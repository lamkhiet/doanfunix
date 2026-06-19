import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { AuthContext, AuthContextProvider } from "./Context/AuthContext";
import "jest-localstorage-mock";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import SignIn from "./Authentication/SignIn";
import Cart from "./Cart/Cart";
import LogoutLink from "./Authentication/LogoutLink";

// Giả lập các mô-đun API bên thứ ba để tránh gọi mạng thật
jest.mock("./API/CustomerAPI", () => ({
  postLogin: jest.fn(),
}));
jest.mock("./API/CartAPI", () => ({
  getCart: jest.fn(),
  deleteFromCart: jest.fn(),
  updateCart: jest.fn(),
}));
jest.mock(
  "./convertMoney",
  () => (value) => (value ? value.toLocaleString("vi-VN") : "0"),
);
jest.mock("alertifyjs", () => ({
  set: jest.fn(),
  error: jest.fn(),
  success: jest.fn(),
}));

import CustomerAPI from "./API/CustomerAPI";
import CartAPI from "./API/CartAPI";

describe("Frontend Logic, Component & State Comprehensive Tests", () => {
  let user;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    jest.clearAllMocks();
    // Khởi tạo instance userEvent cho mỗi ca kiểm thử để giả lập chính xác hành vi bấm phím và chuột
    user = userEvent.setup();
  });

  // -----------------------------------------------------------------------
  // 1. TEST LUỒNG ĐĂNG NHẬP THỰC TẾ VỚI COMPONENT SIGNIN
  // -----------------------------------------------------------------------
  test("renders real SignIn component and dispatches LOGIN_SUCCESS on valid credentials", async () => {
    const mockCustomerData = {
      _id: "60c72b2f9b1d8b0015f84b56",
      fullname: "Nguyen Van A",
      email: "test@gmail.com",
      cart: [],
    };

    // Giả lập API phản hồi thành công cấu trúc dữ liệu mong muốn
    CustomerAPI.postLogin.mockResolvedValueOnce({ customer: mockCustomerData });

    render(
      <MemoryRouter initialEntries={["/signin"]}>
        <AuthContextProvider>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/" element={<div>Home Page</div>} />
          </Routes>
        </AuthContextProvider>
      </MemoryRouter>,
    );

    // Điền thông tin vào các ô nhập liệu bằng userEvent thay vì fireEvent
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    await user.type(emailInput, "test@gmail.com");
    await user.type(passwordInput, "12345678");

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    await user.click(submitButton);

    // Chờ đợi hệ thống đồng bộ dữ liệu vào sessionStorage của AuthContextProvider
    await waitFor(() => {
      const storedCustomer = JSON.parse(sessionStorage.getItem("customer"));
      expect(storedCustomer).not.toBeNull();
      expect(storedCustomer.fullname).toBe("Nguyen Van A");
      expect(storedCustomer.email).toBe("test@gmail.com");
    });

    // Kiểm tra xem ứng dụng có chuyển hướng về trang chủ thành công hay không
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  // -----------------------------------------------------------------------
  // 2. TEST GIỎ HÀNG KHÁCH VÃNG LAI LƯU TRỮ TRÊN LOCALSTORAGE
  // -----------------------------------------------------------------------
  test('should persist and read data using the correct localStorage key "tempCart" inside Cart component', async () => {
    const mockCartData = [
      {
        productId: {
          _id: "prod_1",
          name: "iPhone",
          price: 20000000,
          images: ["iphone.jpg"],
        },
        quantity: 1,
        priceAt: 20000000,
      },
    ];

    // Thiết lập trạng thái ban đầu của bộ nhớ tạm thời cho khách vãng lai
    localStorage.setItem("tempCart", JSON.stringify(mockCartData));

    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <AuthContextProvider>
          <Routes>
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </AuthContextProvider>
      </MemoryRouter>,
    );

    // Xác nhận giao diện hiển thị chính xác tên sản phẩm lấy từ localStorage
    const productName = await screen.findByText("iPhone");
    expect(productName).toBeInTheDocument();

    // Kiểm tra dữ liệu duy trì chính xác trong bộ nhớ mock
    const storedCart = JSON.parse(localStorage.getItem("tempCart"));
    expect(storedCart).not.toBeNull();
    expect(storedCart[0].productId.name).toBe("iPhone");
  });

  // -----------------------------------------------------------------------
  // 3. TEST LOGIC LOGOUT XÓA SESSIONSTORAGE QUA LOGOUTLINK COMPONENT
  // -----------------------------------------------------------------------
  test("should clear customer data from sessionStorage on click LogoutLink", async () => {
    const existingUser = { _id: "123", fullname: "Gia Long", cart: [] };
    sessionStorage.setItem("customer", JSON.stringify(existingUser));

    render(
      <MemoryRouter initialEntries={["/"]}>
        <AuthContextProvider>
          <Routes>
            <Route path="/" element={<LogoutLink />} />
            <Route path="/signin" element={<div>Sign In Page</div>} />
          </Routes>
        </AuthContextProvider>
      </MemoryRouter>,
    );

    const logoutButton = screen.getByText(/\( Đăng Xuất \)/i);
    await user.click(logoutButton);

    // Hệ thống buộc phải làm sạch bộ nhớ phiên làm việc của khách hàng này
    expect(sessionStorage.getItem("customer")).toBeNull();
    expect(screen.getByText("Sign In Page")).toBeInTheDocument();
  });
});
