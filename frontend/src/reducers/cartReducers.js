import {
  ADD_TO_CART,
  PAYMENT_FAIL,
  PAYMENT_REQUEST,
  PAYMENT_RESET,
  PAYMENT_SUCCESS,
  REMOVE_ITEM_CART,
  CLEAR_CART,
  SAVE_SHIPPING_INFO,
  CLEAR_ERRORS,
} from "../constants/cartConstants";

export const cartReducer = (
  state = { cartItems: [], shippingInfo: {} },
  action
) => {
  switch (action.type) {
    case ADD_TO_CART:
      const item = action.payload;
      const isItemExist = state.cartItems.find(
        (i) => i.productID === item.productID
      );

      if (isItemExist) {
        return {
          ...state,
          cartItems: state.cartItems.map((i) =>
            i.productID === isItemExist.productID ? item : i
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }

    case REMOVE_ITEM_CART:
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (i) => i.productID !== action.payload
        ),
      };

    case CLEAR_CART:
      return {
        ...state,
        cartItems: [],
      };

    case SAVE_SHIPPING_INFO:
      return {
        ...state,
        shippingInfo: action.payload,
      };

    case PAYMENT_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case PAYMENT_RESET:
      return {
        ...state,
        result: null,
      };

    case PAYMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        result: action.payload,
      };

    case PAYMENT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
