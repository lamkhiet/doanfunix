import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { AuthContext, AuthContextProvider } from "./Context/AuthContext";

// =========================================================================
// 1. COMPONENT THỰC TẾ (MÔ PHỎNG ĐỂ TEST LOGIC LOGIN + CONTEXT)
// =========================================================================
function RealLoginForm() {
  const { dispatch, error, loading } = React.useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });

    try {
      // Giả lập một lệnh gọi API Login thành công (dùng axios/fetch)
      const mockCustomerData = {
        _id: "60c72b2f9b1d8b0015f84b56",
        fullname: "Nguyen Van A",
        email: "test@gmail.com",
        cart: [],
      };

      dispatch({ type: "LOGIN_SUCCESS", payload: mockCustomerData });
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: "Login Failed!" });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" required />
      {loading && <span>Loading...</span>}
      {error && <span role="alert">{error}</span>}
      <button type="submit">Sign In</button>
    </form>
  );
}

// =========================================================================
// SUITE TEST FRONTEND LOGIC
// =========================================================================
describe("Frontend Logic & State Tests", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  // -----------------------------------------------------------------------
  // TEST LUỒNG ĐĂNG NHẬP KÈM THEO STATE TRONG AUTHCONTEXT
  // -----------------------------------------------------------------------
  test("renders login form and dispatches LOGIN_SUCCESS inside AuthContextProvider", async () => {
    // Render component nằm gọn trong Provider để nhận giá trị State toàn cục
    render(
      <AuthContextProvider>
        <RealLoginForm />
      </AuthContextProvider>,
    );

    // Kiểm tra UI hiển thị đúng
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeInTheDocument();

    // Giả lập click nút Sign In
    const submitButton = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(submitButton);

    // Chờ state cập nhật và kiểm tra xem dữ liệu đã được tự động sync vào sessionStorage chưa
    await waitFor(() => {
      const storedCustomer = JSON.parse(sessionStorage.getItem("customer"));
      expect(storedCustomer).not.null;
      expect(storedCustomer.fullname).toBe("Nguyen Van A");
      expect(storedCustomer.email).toBe("test@gmail.com");
    });
  });

  // -----------------------------------------------------------------------
  // TEST GIỎ HÀNG KHÁCH VÃNG LAI
  // -----------------------------------------------------------------------
  test('should persist data using the correct localStorage key "tempCart"', () => {
    const mockCartData = [
      { id: "prod_1", name: "iPhone", priceAt: 20000000, quantity: 1 },
    ];

    // Giả lập hành vi ghi vào localStorage của App
    localStorage.setItem("tempCart", JSON.stringify(mockCartData));

    // Đọc lại từ localStorage kiểm tra tính chính xác của key
    const storedCart = JSON.parse(localStorage.getItem("tempCart"));

    expect(storedCart).toBeDefined();
    expect(storedCart[0].name).toBe("iPhone");
    expect(localStorage.getItem("tempCart")).toBeNull();
  });

  // -----------------------------------------------------------------------
  // TEST LOGIC LOGOUT XÓA SESSIONSTORAGE
  // -----------------------------------------------------------------------
  test("should clear customer data from sessionStorage on LOGOUT action", () => {
    // Giả lập trạng thái đã đăng nhập sẵn trong sessionStorage
    const existingUser = { _id: "123", fullname: "Gia Long" };
    sessionStorage.setItem("customer", JSON.stringify(existingUser));

    // Tạo component giả lập nút bấm Logout để kích hoạt dispatch
    const LogoutComponent = () => {
      const { dispatch } = React.useContext(AuthContext);
      return (
        <button onClick={() => dispatch({ type: "LOGOUT" })}>Logout</button>
      );
    };

    render(
      <AuthContextProvider>
        <LogoutComponent />
      </AuthContextProvider>,
    );

    // Kích hoạt nút Logout
    fireEvent.click(screen.getByRole("button", { name: /logout/i }));

    // Khẳng định sessionStorage buộc phải trống trơn
    expect(sessionStorage.getItem("customer")).toBeNull();
  });
});
