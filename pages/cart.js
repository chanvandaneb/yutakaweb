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
import Footer from "@/components/Footer";
import Swal from "sweetalert2";

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

const BigImage = styled.img`
    margin: 0 auto;
    height: 250px;
    min-width: 250px;
    object-fit: cover;
    border-radius: 10px;
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
    font-size: 20px;
  font-weight: 800;
  padding: 0 15px;
  color: #696969;
  display: block;
  @media screen and (min-width: 768px) {
    display: inline-block;
    padding: 0 6px;
  }
`;



export default function CartPage() {
    const {cartProducts,addProduct,removeProduct,clearCart} = useContext(CartContext);
    const {data:session} = useSession();
    const [products,setProducts] = useState([]);
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [city,setCity] = useState('');
    const [streetAddress,setStreetAddress] = useState('');
    const [province,setProvince] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isSuccess,setIsSuccess] = useState(false);
    const [shippingFee, setShippingFee] = useState([]);
    const [vatFee, setVatFee] = useState([]);
    const [coupon, setCoupon] = useState([]);
    
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
        axios.get('/api/settings?name=vatFee').then(res => {
            setVatFee(res.data.value);
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
            setStreetAddress(response.data.streetAddress);
            setCity(response.data.city);
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
            name,email,streetAddress,city,province,phoneNumber,
            cartProducts,
        });

        if (response.data === "Out of Stock"){
            alert('Out of stock')
            Swal.fire("Item in out not enough! ");
            return;
        }

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

    let listTotal = parseFloat(productsTotal) + parseFloat(shippingFee) + parseFloat(vatFee) 
    let floatTotal = parseFloat(listTotal).toFixed(2)

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
                    <h3 class="my-4 text-center text-3xl font-semibold text-gray-700">Success Order!</h3>
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
                    <RevealWrapper delay={0} className="shadow-md">
                        <Box>
                            <h2 className="font-bold text-gray-800 mb-1">Cart</h2>
                            {!cartProducts?.length && (
                                <div>
                                <h1 className="text-gray-400">Your cart is empty</h1>
                                <img className="h-[400px] ml-20 opacity-30" src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-7359557-6024626.png"/>
                                
                                </div>
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
                                                <br/>
                                                <h1 className="font-bold text-gray-600">{product.title}</h1>
                                            </ProductInfoCell>
                                            <td>
                                                <button className="mr-2 px-4 py-2 font-black hover:border-red-400 border border-2 border-gray-300 text-gray-600 hover:text-red-400 rounded-full"
                                                    onClick={() => lessOfThisProduct(product._id)}>-</button>
                                                <QuantityLabel>
                                                    {cartProducts.filter(id => id === product._id).length}
                                                </QuantityLabel>
                                                <button className="ml-2 px-4 py-2 font-black hover:border-blue-700 border border-2 border-gray-300 text-gray-600 hover:text-blue-700 rounded-full"
                                                    onClick={() => moreOfThisProduct(product._id)}>+</button>
                                            </td>
                                            <td className="text-gray-500">
                                                ${product.price}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="subtotal text-gray-500 text-sm">
                                        <td colSpan={2}>Products Total</td>
                                        <td>${productsTotal}</td>
                                    </tr>
                                    <tr className="subtotal text-gray-500 text-sm">
                                        <td colSpan={2}>Delivery Fee</td>
                                        <td>${shippingFee}</td>
                                    </tr>
                                    <tr className="subtotal text-gray-500 text-sm">
                                        <td colSpan={2}>VAT Fee</td>
                                        <td>${vatFee}</td>
                                    </tr>
                                    
                                    <tr className="subtotal total text-2xl">
                                        <td colSpan={2}>Total</td>
                                        <td>${ floatTotal }</td>
                                    </tr>
                                    </tbody>
                                </Table>
                            )}
                        </Box>
                    </RevealWrapper>
                    {!!cartProducts?.length && (
                        <RevealWrapper delay={100} className="shadow-md">
                            <Box >
                                <h1 className="font-bold text-gray-800 mb-1">Order information</h1>
                                <Input className="mt-1" type="text"
                                placeholder="Name"
                                value={name}
                                name="name"
                                onChange={ev => setName(ev.target.value)}/>


                             <Input className="mt-1" type="number"
                                placeholder="Phone Number"
                                value={phoneNumber}
                                name="phoneNumber"
                                onChange={ev => setPhoneNumber(ev.target.value)}/>


                         <Input className="mt-1" type="text"
                                placeholder="Email"
                                value={email}
                                name="email"
                                onChange={ev => setEmail(ev.target.value)}/>

                         
                             <Input className="mt-1" type="text"
                                placeholder="Street Address"
                                value={streetAddress}
                                name="streetAddress"
                                onChange={ev => setStreetAddress(ev.target.value)}/>

                         <Input className="mt-1" type="text"
                                    placeholder="City"
                                    value={city}
                                    name="city"
                                    onChange={ev => setCity(ev.target.value)}/>


                         <Input className="mt-1" type="text"
                                placeholder="Province"
                                value={province}
                                name="province"
                                onChange={ev => setProvince(ev.target.value)}/>


                                <button className="mt-5 w-full text-white py-3 rounded-md bg-blue-600 hover:bg-blue-700" block
                                        onClick={goToPayment}>
                                    Continue to payment
                                </button>
                            </Box>
                        </RevealWrapper>
                    )}
                </ColumnsWrapper>
            </Center>
            <Footer/>
        </>
    );
}
