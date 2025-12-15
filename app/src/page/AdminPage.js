import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_BASE_URL = "http://localhost:5001";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("products"); // products, register, sales
  const [products, setProducts] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 날짜 필터
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // 상품 등록 폼
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: [],
    material: "",
    price: "",
    discountRate: 0,
    is_on_sale: false,
    sizes: [],
  });
  const [productImages, setProductImages] = useState([]);

  // 상품 수정 모달
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (activeTab === "products") {
      fetchProducts();
    } else if (activeTab === "sales") {
      fetchSalesReport();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/admin/products`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "상품 목록을 불러오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesReport = async () => {
    try {
      setLoading(true);
      const params = {};
      if (startDate) {
        params.startDate = startDate.toISOString().split('T')[0];
      }
      if (endDate) {
        params.endDate = endDate.toISOString().split('T')[0];
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/admin/sales-report`,
        {
          params,
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setSalesData(response.data.salesData);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "판매 현황을 불러오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  // 카테고리 토글
  const toggleCategory = (cat) => {
    setNewProduct((prev) => ({
      ...prev,
      category: prev.category.includes(cat)
        ? prev.category.filter((c) => c !== cat)
        : [...prev.category, cat],
    }));
  };

  // 사이즈 토글
  const toggleSize = (size) => {
    setNewProduct((prev) => {
      const exists = prev.sizes.find((s) => s.size === size);
      if (exists) {
        return {
          ...prev,
          sizes: prev.sizes.filter((s) => s.size !== size),
        };
      } else {
        return {
          ...prev,
          sizes: [...prev.sizes, { size, available: true }],
        };
      }
    });
  };

  // 상품 등록
  const handleRegisterProduct = async (e) => {
    e.preventDefault();

    if (productImages.length < 2) {
      alert("이미지는 최소 2개 이상 등록해야 합니다.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      formData.append("category", newProduct.category.join(","));
      formData.append("material", newProduct.material);
      formData.append("price", newProduct.price);
      formData.append("discountRate", newProduct.discountRate);
      formData.append("is_on_sale", newProduct.is_on_sale);
      formData.append("sizes", JSON.stringify(newProduct.sizes));

      productImages.forEach((image) => {
        formData.append("images", image);
      });

      const response = await axios.post(
        `${API_BASE_URL}/api/admin/products`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        alert("상품이 등록되었습니다!");
        // 폼 초기화
        setNewProduct({
          name: "",
          description: "",
          category: [],
          material: "",
          price: "",
          discountRate: 0,
          is_on_sale: false,
          sizes: [],
        });
        setProductImages([]);
        setActiveTab("products");
        fetchProducts();
      }
    } catch (err) {
      alert(err.response?.data?.message || "상품 등록에 실패했습니다.");
    }
  };

  // 사이즈 가용성 토글
  const toggleSizeAvailability = async (productId, size) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/admin/products/${productId}/sizes`,
        { size },
        { withCredentials: true }
      );
      if (response.data.success) {
        alert(response.data.message);
        fetchProducts();
      }
    } catch (err) {
      alert(err.response?.data?.message || "사이즈 변경에 실패했습니다.");
    }
  };

  // 할인율 변경
  const updateDiscount = async (productId, discountRate) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/admin/products/${productId}/discount`,
        { discountRate: Number(discountRate) },
        { withCredentials: true }
      );
      if (response.data.success) {
        alert(response.data.message);
        fetchProducts();
        setShowEditModal(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || "할인율 변경에 실패했습니다.");
    }
  };

  // 상품 삭제
  const deleteProduct = async (productId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/admin/products/${productId}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        alert("상품이 삭제되었습니다.");
        fetchProducts();
      }
    } catch (err) {
      alert(err.response?.data?.message || "상품 삭제에 실패했습니다.");
    }
  };

  const availableSizes = [
    250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300,
  ];
  const materials = ["wool", "tree", "sugar", "canvas"];

  return (
    <Container>
      <Title>관리자 페이지</Title>

      <TabContainer>
        <Tab
          active={activeTab === "products"}
          onClick={() => setActiveTab("products")}
        >
          상품 관리
        </Tab>
        <Tab
          active={activeTab === "register"}
          onClick={() => setActiveTab("register")}
        >
          상품 등록
        </Tab>
        <Tab
          active={activeTab === "sales"}
          onClick={() => setActiveTab("sales")}
        >
          판매 현황
        </Tab>
      </TabContainer>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {loading && <LoadingMessage>로딩 중...</LoadingMessage>}

      {/* 상품 관리 탭 */}
      {activeTab === "products" && (
        <Section>
          <SectionTitle>상품 목록</SectionTitle>
          <ProductTable>
            <thead>
              <tr>
                <th>이미지</th>
                <th>상품명</th>
                <th>카테고리</th>
                <th>가격</th>
                <th>할인율</th>
                <th>사이즈</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    {product.images && product.images[0] && (
                      <ProductImage
                        src={`${product.images[0]}`}
                        alt={product.name}
                      />
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category?.join(", ")}</td>
                  <td>₩{product.price?.toLocaleString()}</td>
                  <td>{product.discountRate}%</td>
                  <td>
                    <SizeList>
                      {product.sizes?.map((s) => (
                        <SizeButton
                          key={s.size}
                          available={s.available}
                          onClick={() =>
                            toggleSizeAvailability(product._id, s.size)
                          }
                        >
                          {s.size}
                        </SizeButton>
                      ))}
                    </SizeList>
                  </td>
                  <td>
                    <ButtonGroup>
                      <SmallButton
                        onClick={() => {
                          setEditingProduct(product);
                          setShowEditModal(true);
                        }}
                      >
                        할인율<br></br>수정
                      </SmallButton>
                      <SmallButton
                        danger
                        onClick={() => deleteProduct(product._id)}
                      >
                        삭제
                      </SmallButton>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </ProductTable>
        </Section>
      )}

      {/* 상품 등록 탭 */}
      {activeTab === "register" && (
        <Section>
          <SectionTitle>상품 등록</SectionTitle>
          <Form onSubmit={handleRegisterProduct}>
            <FormGroup>
              <Label>상품명 *</Label>
              <Input
                type="text"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>상품 설명 *</Label>
              <TextArea
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>카테고리 * (복수 선택 가능)</Label>
              <CheckboxGroup>
                <CheckboxLabel>
                  <input
                    type="checkbox"
                    checked={newProduct.category.includes("lifestyle")}
                    onChange={() => toggleCategory("lifestyle")}
                  />
                  라이프 스타일
                </CheckboxLabel>
                <CheckboxLabel>
                  <input
                    type="checkbox"
                    checked={newProduct.category.includes("slipon")}
                    onChange={() => toggleCategory("slipon")}
                  />
                  슬립온
                </CheckboxLabel>
              </CheckboxGroup>
            </FormGroup>

            <FormGroup>
              <Label>소재 *</Label>
              <Select
                value={newProduct.material}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, material: e.target.value })
                }
                required
              >
                <option value="">선택하세요</option>
                {materials.map((mat) => (
                  <option key={mat} value={mat}>
                    {mat}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>가격 *</Label>
              <Input
                type="number"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>할인율 (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={newProduct.discountRate}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, discountRate: e.target.value })
                }
              />
            </FormGroup>

            <FormGroup>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={newProduct.is_on_sale}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      is_on_sale: e.target.checked,
                    })
                  }
                />
                세일 상품
              </CheckboxLabel>
            </FormGroup>

            <FormGroup>
              <Label>가용 사이즈 *</Label>
              <SizeGrid>
                {availableSizes.map((size) => (
                  <SizeCheckbox
                    key={size}
                    selected={newProduct.sizes.some((s) => s.size === size)}
                    onClick={() => toggleSize(size)}
                  >
                    {size}
                  </SizeCheckbox>
                ))}
              </SizeGrid>
            </FormGroup>

            <FormGroup>
              <Label>상품 이미지 * (최소 2개)</Label>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setProductImages(Array.from(e.target.files))}
              />
              <small>선택된 파일: {productImages.length}개</small>
            </FormGroup>

            <SubmitButton type="submit">상품 등록</SubmitButton>
          </Form>
        </Section>
      )}

      {/* 판매 현황 탭 */}
      {activeTab === "sales" && (
        <Section>
          <SectionTitle>판매 현황</SectionTitle>

          <FilterContainer>
            <FormGroup>
              <Label>시작일</Label>
              <DatePickerWrapper>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="시작일 선택"
                  isClearable
                />
              </DatePickerWrapper>
            </FormGroup>
            <FormGroup>
              <Label>종료일</Label>
              <DatePickerWrapper>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="종료일 선택"
                  isClearable
                />
              </DatePickerWrapper>
            </FormGroup>
            <FilterButton onClick={fetchSalesReport}>조회</FilterButton>
          </FilterContainer>

          <SalesTable>
            <thead>
              <tr>
                <th>상품명</th>
                <th>판매 수량</th>
                <th>총 매출</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((sale, index) => (
                <tr key={index}>
                  <td>{sale.productName}</td>
                  <td>{sale.totalQuantity}개</td>
                  <td>₩{sale.totalRevenue?.toLocaleString()}</td>
                </tr>
              ))}
              {salesData.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    style={{ textAlign: "center", padding: "40px" }}
                  >
                    판매 데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </SalesTable>
        </Section>
      )}

      {/* 할인율 수정 모달 */}
      {showEditModal && editingProduct && (
        <Modal>
          <ModalContent>
            <ModalTitle>할인율 수정</ModalTitle>
            <p>
              <strong>{editingProduct.name}</strong>
            </p>
            <p>현재 할인율: {editingProduct.discountRate}%</p>
            <FormGroup>
              <Label>새로운 할인율 (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                defaultValue={editingProduct.discountRate}
                id="newDiscountRate"
              />
            </FormGroup>
            <ModalButtonGroup>
              <ModalButton
                onClick={() => {
                  const newRate =
                    document.getElementById("newDiscountRate").value;
                  updateDiscount(editingProduct._id, newRate);
                }}
              >
                적용
              </ModalButton>
              <ModalButton secondary onClick={() => setShowEditModal(false)}>
                취소
              </ModalButton>
            </ModalButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 30px;
  color: #212121;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 2px solid #eee;
`;

const Tab = styled.button`
  padding: 15px 30px;
  background: ${(props) => (props.active ? "#212121" : "transparent")};
  color: ${(props) => (props.active ? "#fff" : "#666")};
  border: none;
  border-bottom: 3px solid
    ${(props) => (props.active ? "#212121" : "transparent")};
  cursor: pointer;
  font-size: 16px;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  transition: all 0.3s;

  &:hover {
    background: ${(props) => (props.active ? "#212121" : "#f5f5f5")};
  }
`;

const Section = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #212121;
`;

const ProductTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 15px;
    text-align: center;
    border-bottom: 1px solid #eee;
  }

  th {
    background: #f5f5f5;
    font-weight: bold;
    color: #666;
  }

  tr:hover {
    background: #fafafa;
  }
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
`;

const SizeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const SizeButton = styled.button`
  padding: 5px 10px;
  border: 1px solid ${(props) => (props.available ? "#4CAF50" : "#ccc")};
  background: ${(props) => (props.available ? "#E8F5E9" : "#f5f5f5")};
  color: ${(props) => (props.available ? "#2E7D32" : "#999")};
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    opacity: 0.8;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 5px;
  flex-direction: column;
`;

const SmallButton = styled.button`
  padding: 8px 12px;
  background: ${(props) => (props.danger ? "#f44336" : "#2196F3")};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  font-size: 13px;

  &:hover {
    opacity: 0.9;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: bold;
  color: #333;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #212121;
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #212121;
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #212121;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  gap: 20px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const SizeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
`;

const SizeCheckbox = styled.div`
  padding: 12px;
  border: 2px solid ${(props) => (props.selected ? "#212121" : "#ddd")};
  background: ${(props) => (props.selected ? "#f5f5f5" : "white")};
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  font-weight: ${(props) => (props.selected ? "bold" : "normal")};

  &:hover {
    border-color: #212121;
  }
`;

const SubmitButton = styled.button`
  padding: 15px 30px;
  background: #212121;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background: #424242;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  align-items: flex-end;
`;

const DatePickerWrapper = styled.div`
  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: #212121;
    }
  }

  .react-datepicker {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .react-datepicker__header {
    background-color: #212121;
    border-bottom: none;
    border-radius: 8px 8px 0 0;
  }

  .react-datepicker__current-month,
  .react-datepicker__day-name {
    color: #fff;
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--in-selecting-range,
  .react-datepicker__day--in-range {
    background-color: #212121;
    color: #fff;
  }

  .react-datepicker__day--keyboard-selected {
    background-color: #424242;
    color: #fff;
  }

  .react-datepicker__day:hover {
    background-color: #f5f5f5;
  }

  .react-datepicker__day--selected:hover,
  .react-datepicker__day--in-selecting-range:hover,
  .react-datepicker__day--in-range:hover {
    background-color: #424242;
  }

  .react-datepicker__close-icon::after {
    background-color: #666;
    font-size: 16px;
  }
`;

const FilterButton = styled.button`
  padding: 12px 30px;
  background: #212121;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  height: fit-content;

  &:hover {
    background: #424242;
  }
`;

const SalesTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    background: #f5f5f5;
    font-weight: bold;
    color: #666;
  }

  tbody tr:hover {
    background: #fafafa;
  }
`;

const ErrorMessage = styled.div`
  background: #ffebee;
  color: #c62828;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  min-width: 400px;
`;

const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const ModalButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const ModalButton = styled.button`
  flex: 1;
  padding: 12px;
  background: ${(props) => (props.secondary ? "#ccc" : "#212121")};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    opacity: 0.9;
  }
`;

export default AdminPage;
