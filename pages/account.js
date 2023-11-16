import Header from "@/components/Header";
import Center from "@/components/Center";
import {signIn, signOut, useSession} from "next-auth/react";
import styled from "styled-components";
import WhiteBox from "@/components/WhiteBox";
import {RevealWrapper} from "next-reveal";
import Input from "@/components/Input";
import {useEffect, useState} from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import ProductBox from "@/components/ProductBox";
import Tabs from "@/components/Tabs";
import SingleOrder from "@/components/SingleOrder";


const ColsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.2fr .8fr;
  gap: 40px;
  margin: 40px 0;
  p{
    
  }
`;

const WishedProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 35px;
`;


export default function AccountPage() {
    const {data: session} = useSession();
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [city,setCity] = useState('');
    const [postalCode,setPostalCode] = useState('');
    const [streetAddress,setStreetAddress] = useState('');
    const [province,setProvince] = useState('');
    const [phoneNumber,setPhoneNumber] = useState('');
    const [addressLoaded,setAddressLoaded] = useState(true);
    const [wishlistLoaded,setWishlistLoaded] = useState(true);
    const [orderLoaded,setOrderLoaded] = useState(true);
    const [wishedProducts,setWishedProducts] = useState([]);
    const [activeTab, setActiveTab] = useState('Orders');
    const [orders,setOrders] = useState([]);
    async function logout() {
        await signOut({
            callbackUrl: process.env.NEXT_PUBLIC_URL,
        });
    }
    async function login() {
        await signIn('google')
    }

    function saveAddress() {
        const data = {name,email,city,streetAddress,postalCode,province,phoneNumber};
        axios.put('/api/address', data);
    }

    useEffect(() => {
            if (!session) {
                return;
            }
            setAddressLoaded(false);
            setWishlistLoaded(false);
            setOrderLoaded(false);
            axios.get('/api/address').then(response => {
                setName(response.data?.name);
                setEmail(response.data?.email);
                setCity(response.data?.city);
                setPostalCode(response.data?.postalCode);
                setStreetAddress(response.data?.streetAddress);
                setProvince(response.data?.province);
                setPhoneNumber(response.data?.phoneNumber);
                setAddressLoaded(true);
            });
            axios.get('/api/wishlist').then(response => {
                setWishedProducts(response.data.map(wp => wp.product));
                setWishlistLoaded(true);
            });
            axios.get('/api/orders').then(response => {
                setOrders(response.data);
                setOrderLoaded(true);
            });
    }, [session]);

    function productRemovedFromWishlist(idToRemove) {
        setWishedProducts(products => {
           return [...products.filter(p => p._id.toString() !== idToRemove)];
        });
    }
    return(
        <>
            <Header/>
            <Center>
                <ColsWrapper>
                    <div>
                        <RevealWrapper delay={0}>
                            <WhiteBox className="shadow-md">
                                <Tabs tabs={['Orders','Wishlist']} active={activeTab} onChange={setActiveTab}/>
                                {activeTab === 'Orders' && (
                                    <>
                                        {!orderLoaded && (
                                            <Spinner fullWidth={true}/>
                                        )}
                                        {orderLoaded && (
                                           <div>
                                               {orders.length === 0 && (
                                                   <p>Login to see your orders</p>
                                               )}
                                               {orders.length > 0 && orders.map(o => (
                                                   // eslint-disable-next-line react/jsx-key
                                                   <SingleOrder {...o}/>
                                               ))}
                                           </div>
                                        )}
                                    </>
                                )}
                                {activeTab === 'Wishlist' && (
                                    <>
                                        {!wishlistLoaded && (
                                            <Spinner fullWidth={true}/>
                                        )}
                                        {wishlistLoaded && (
                                            <>
                                                <WishedProductGrid>
                                                    {wishedProducts.length > 0 && wishedProducts.map(wp => (
                                                        // eslint-disable-next-line react/jsx-key
                                                        <ProductBox key={wp._id} {...wp} wished={true}
                                                                    onRemoveFromWishlist={productRemovedFromWishlist}/>
                                                    ))}
                                                </WishedProductGrid>
                                                {wishedProducts.length === 0 && (
                                                    <>
                                                        {session && (
                                                            <p>Your wishlist is empty</p>
                                                        )}
                                                        {!session && (
                                                            <p>Login to add product to your wishlist</p>
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}

                            </WhiteBox>
                        </RevealWrapper>
                    </div>
                    <div>
                        <RevealWrapper delay={100}>
                            <WhiteBox className="shadow-md">
                                <h2 className="font-bold text-gray-800 mb-1">{session ? 'Account Information' : 'Login Now'}</h2>
                                {!addressLoaded && (
                                    <Spinner fullWidth={true}/>
                                )}
                                {addressLoaded && session && (
                                    <>
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


                                        


                                        <button className="mt-5 w-full text-white py-3 rounded-md bg-blue-600 hover:bg-blue-700 " block onClick={saveAddress}>Save</button>
                                        <hr/>
                                    </>
                                )}
                                {session && (
                                    <button className="mt-5 px-5 py-3 bg-gray-200 text-gray-700 hover:text-red-600 hover:bg-red-200 rounded-lg" onClick={logout}>Logout</button>
                                )}
                                {!session && (
                                    <button onClick={login} className="flex items-center justify-center w-full mt-5 py-4 rounded-full border border-2 border-blue-500 hover:bg-blue-300 ">
                                    <img class="h-5 mr-2" src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/logos/logo-google.png" alt=""/>
                                    Sign in with Google
                                  </button>
                                )}
                            </WhiteBox>
                        </RevealWrapper>
                    </div>
                </ColsWrapper>
            </Center>
        </>
    );
}