import Center from "@/components/Center";
import styled from "styled-components";
import ButtonLink from "@/components/ButtonLink";
import CartIcon from "@/components/icons/CartIcon";
import FlyingButton from "@/components/FlyingButton";
import {RevealWrapper} from 'next-reveal';


const Bg = styled.div`
  background-color: #222;
  color: #fff;
  padding: 80px 0;
  
`;
const Title = styled.h1`
  margin: 0;
  font-weight: normal;
  font-size: 1.5rem;
  @media screen and (min-width: 768px){
    font-size: 3rem;
  }
`;

const Desc = styled.p`
  color: #aaa;
  font-size: .8rem;
`;

const CulumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  div:nth-child(1){
    order: 2;
    margin-left: auto;
    margin-right: auto;
  }
  @media screen and (min-width: 768px){
    grid-template-columns: 1.1fr 0.9fr;
    & > div:nth-child(1){
      order: 0;
    }
    img{
      max-width: 100%;
    }
  }
`;

const Culumn = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 25px;
`;

const CenterImg = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    margin: 0 auto;
    height: 300px;
    min-width: 300px;
    object-fit: cover;
    border-radius: 20px;
  }
`;


const ImgColumn = styled(Culumn)`
  & > div{
    width: 100%;
  }
`;

const ContentWrapper = styled.div`
  
`;
export default function Featured({product}) {
    return (
        <Bg>
            <Center>
                <CulumnsWrapper>
                    <Culumn>
                        <div>
                            <RevealWrapper origin={'left'} delay={0}>
                                <ContentWrapper>
                                    <Title>{product?.title}</Title>
                                    <Desc>{product?.description}</Desc>
                                    <ButtonsWrapper>
                                        <ButtonLink href={'/product/' + product?._id} outline={1} white={1} >Read More</ButtonLink>
                                        <FlyingButton white={1} _id={product?._id} src={product?.images?.[0]}>
                                            <CartIcon />
                                            Add to cart
                                        </FlyingButton>
                                    </ButtonsWrapper>
                                </ContentWrapper>
                            </RevealWrapper>
                        </div>
                    </Culumn>
                    <ImgColumn>
                        <RevealWrapper delay={0}>
                            <CenterImg>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img className={'main'} src={product?.images?.[0]} alt=""/>
                            </CenterImg>
                        </RevealWrapper>
                    </ImgColumn>
                </CulumnsWrapper>
            </Center>
        </Bg>
    );
}