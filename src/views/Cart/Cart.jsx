import React, { useEffect } from "react";
import CartItem from "../../components/CartItem/CartItem";
import { useDispatch, useSelector } from "react-redux";
import {
  getCartbyUserId,
  deleteItemCart,
  clearCart,
} from "../../redux/actions/action-store";

import "./PaypalButton.css";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userProfile);
  const userId = user.id;

  useEffect(() => {
    if (userId) dispatch(getCartbyUserId(userId));
  }, [dispatch, userId]);

  const cartItems = useSelector((state) => state.store.cart);

  let products = cartItems?.Products;
  //const totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);

  let totalCompra = 0;

  const handleDeleteItem = (productId) => {
    dispatch(deleteItemCart(userId, productId));
    window.location.reload();
  };

  const handleEmptyCart = () => {
    dispatch(clearCart(userId));
  };

  const handlePayment = () => {
    //lógica back
  };

  return (
    <div>
      <div>
        <thead>
          <tr>
            <p>Producto</p>

            <p>Precio</p>
          </tr>
        </thead>
        <tbody>
          {products?.map((p) => {
            totalCompra =
              totalCompra + parseFloat(p.price) * p.CartProduct.quantity;
            return (
              <tr key={p.id}>
                <td>
                  <img src={p?.image_path} alt={`Imágen de ${p?.name}`} />
                </td>
                <td>
                  <p>{p?.name}</p>
                </td>
                <td>
                  <p>
                    {" "}
                    ${p?.price} x {p?.CartProduct.quantity}
                  </p>
                </td>
                <td>
                  {/* Botón para eliminar el ítem */}
                  <button onClick={() => handleDeleteItem(p?.id)}>
                    Quitar
                  </button>
                </td>
              </tr>
            );
          })}
          {products ? (
            <button onClick={() => handleEmptyCart()}>Vaciar Carrito</button>
          ) : (
            ""
          )}
          <tr>
            <td>
              <p>TOTAL: ${totalCompra}</p>
            </td>
          </tr>
        </tbody>
        <span>Finalizar Compra</span>
        <PayPalScriptProvider
          options={{
            "client-id":
              "AT-UuP_m-l12lYgbpzNTwHUB0O44OeEPBNht2k2wTy5MWiohCg-hcRMImfIs367iukWgQMNud4P1sz1k",
          }}
        >
          <PayPalButtons
            className="custom-button"
            style={{ layout: "vertical", height: 55, color: "gold" }}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: totalCompra,
                    },
                  },
                ],
              });
            }}
            onApprove={(data, actions) => {
              return actions.order.capture().then((details) => {
                navigate("/success");
              });
            }}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  );
};

export default Cart;
