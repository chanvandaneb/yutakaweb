import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import Button from "@/components/Button";
import {useContext, useEffect, useState} from "react";
import {CartContext} from "@/components/CartContext";
import axios from "axios";
import Table from "@/components/Table";
import Input from "@/components/Input";
import {RevealWrapper} from "next-reveal";
import {useSession} from "next-auth/react";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr .8fr;
  }
  gap: 40px;
  margin-top: 40px;
  margin-bottom: 40px;
  table thead tr th:nth-child(3),
  table tbody tr td:nth-child(3),
  table tbody tr.subtotal td:nth-child(2){
    text-align: right;
  }
  table tr.subtotal td{
    padding: 15px 0;
  }
  table tbody tr.subtotal td:nth-child(2){
    font-size: 1.4rem;
  }
  tr.total td{
    font-weight: bold;
  }
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

const ProductInfoCell = styled.td`
  padding: 10px 0;
  button{padding:0 !important;}
`;

const ProductImageBox = styled.div`
  width: 70px;
  height: 100px;
  padding: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display:flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img{
    max-width: 60px;
    max-height: 60px;
  }
  @media screen and (min-width: 768px) {
    padding: 10px;
    width: 100px;
    height: 100px;
    img{
      max-width: 80px;
      max-height: 80px;
    }
  }
`;

const QuantityLabel = styled.span`
  padding: 0 15px;
  display: block;
  @media screen and (min-width: 768px) {
    display: inline-block;
    padding: 0 6px;
  }
`;

const CityHolder = styled.div`
  display:flex;
  gap: 5px;
`;

export default function CartPage() {
    const {cartProducts,addProduct,removeProduct,clearCart} = useContext(CartContext);
    const {data:session} = useSession();
    const [products,setProducts] = useState([]);
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [city,setCity] = useState('');
    const [postalCode,setPostalCode] = useState('');
    const [streetAddress,setStreetAddress] = useState('');
    const [province,setProvince] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isSuccess,setIsSuccess] = useState(false);
    const [shippingFee, setShippingFee] = useState([]);
    useEffect(() => {
        if (cartProducts.length > 0) {
            axios.post('/api/cart', {ids:cartProducts})
                .then(response => {
                    setProducts(response.data);
                })
        } else {
            setProducts([]);
        }
    }, [cartProducts]);
    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }
        if (window?.location.href.includes('success')) {
            setIsSuccess(true);

        }
        axios.get('/api/settings?name=shippingFee').then(res => {
            setShippingFee(res.data.value);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (!session) {
            return;
        }
        axios.get('/api/address').then(response => {
            setName(response.data.name);
            setEmail(response.data.email);
            setCity(response.data.city);
            setPostalCode(response.data.postalCode);
            setStreetAddress(response.data.streetAddress);
            setProvince(response.data.province);
            setPhoneNumber(response.data.phoneNumber);
        });
    }, [session]);
    function moreOfThisProduct(id) {
        addProduct(id);
    }
    function lessOfThisProduct(id) {
        removeProduct(id);
    }
    async function goToPayment() {
        const response = await axios.post('/api/checkout', {
            name,email,city,postalCode,streetAddress,province,phoneNumber,
            cartProducts,
        });
        if (response.data.url ) {
            window.location = response.data.url;
            clearCart();
        }

    }
    let productsTotal = 0;
    for (const productId of cartProducts) {
        const price = products.find(p => p._id === productId)?.price || 0;
        productsTotal += price;
    }

    if (isSuccess) {
        return (
            <>
                <Header />
                <Center>
                <div class="flex min-h-screen items-center justify-center">
                  <div class="rounded-lg bg-white px-16 py-14 shadow-md">
                    <div class="flex justify-center">
                      <div class="rounded-full bg-green-200 p-6">
                        <div class="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 p-4">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-8 w-8 text-white">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <h3 class="my-4 text-center text-3xl font-semibold text-gray-700">Congratuation!!!</h3>
                    <p class="w-[230px] text-center font-normal text-gray-600">Your order have been success and is being prepare for you</p>
                    <a href={'/account'} class="mx-auto mt-10 block rounded-xl border-4 border-transparent bg-blue-500 px-6 py-3 text-center text-base font-medium text-blue-100 outline-8 hover:outline hover:duration-300">Check Your Order</a>
                  </div>
                </div>
                </Center>
            </>
        );
    }
    return (
        <>
            <Header />
            <Center>
                <ColumnsWrapper>
                    <RevealWrapper delay={0}>
                        <Box>
                            <h2>Cart</h2>
                            {!cartProducts?.length && (
                                <div>Your cart is empty</div>
                            )}
                            {products?.length > 0 && (
                                <Table>
                                    <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {products.map(product => (
                                        // eslint-disable-next-line react/jsx-key
                                        <tr>
                                            <ProductInfoCell>
                                                <ProductImageBox>
                                                    <img src={product.images[0]} alt=""/>
                                                </ProductImageBox>
                                                {product.title}
                                            </ProductInfoCell>
                                            <td>
                                                <Button
                                                    onClick={() => lessOfThisProduct(product._id)}>-</Button>
                                                <QuantityLabel>
                                                    {cartProducts.filter(id => id === product._id).length}
                                                </QuantityLabel>
                                                <Button
                                                    onClick={() => moreOfThisProduct(product._id)}>+</Button>
                                            </td>
                                            <td>
                                                ${cartProducts.filter(id => id === product._id).length * product.price}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="subtotal">
                                        <td colSpan={2}>Products</td>
                                        <td>${productsTotal}</td>
                                    </tr>
                                    <tr className="subtotal">
                                        <td colSpan={2}>Shipping</td>
                                        <td>${shippingFee}</td>
                                    </tr>
                                    <tr className="subtotal total">
                                        <td colSpan={2}>Total</td>
                                        <td>${productsTotal + parseInt(shippingFee || 0)}</td>
                                    </tr>
                                    </tbody>
                                </Table>
                            )}
                        </Box>
                    </RevealWrapper>
                    {!!cartProducts?.length && (
                        <RevealWrapper delay={100}>
                            <Box>
                                <h2>Order information</h2>
                                <Input type="text"
                                       placeholder="Name"
                                       value={name}
                                       name="name"
                                       onChange={ev => setName(ev.target.value)} />
                                <Input type="text"
                                       placeholder="Email"
                                       value={email}
                                       name="email"
                                       onChange={ev => setEmail(ev.target.value)}/>
                                <CityHolder>
                                    <Input type="text"
                                           placeholder="City"
                                           value={city}
                                           name="city"
                                           onChange={ev => setCity(ev.target.value)}/>
                                    <Input type="text"
                                           placeholder="Postal Code"
                                           value={postalCode}
                                           name="postalCode"
                                           onChange={ev => setPostalCode(ev.target.value)}/>
                                </CityHolder>
                                <Input type="text"
                                       placeholder="Street Address"
                                       value={streetAddress}
                                       name="streetAddress"
                                       onChange={ev => setStreetAddress(ev.target.value)}/>
                                <Input type="text"
                                       placeholder="Province"
                                       value={province}
                                       name="province"
                                       onChange={ev => setProvince(ev.target.value)}/>
                                <Input type="number"
                                       placeholder="Phone Number"
                                       value={phoneNumber}
                                       name="phone Number"
                                       onChange={ev => setPhoneNumber(ev.target.value)}/>
                                <Button black block
                                        onClick={goToPayment}>
                                    Continue to payment
                                </Button>
                            </Box>
                        </RevealWrapper>
                    )}
                </ColumnsWrapper>
            </Center>
        </>
    );
}
