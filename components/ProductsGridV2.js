import styled from "styled-components";
import ProductBox from "@/components/ProductBox";
import {RevealWrapper} from "next-reveal";
import { useEffect, useState } from "react";

const StyledProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  @media screen and (min-width: 768px){
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;
export default function ProductsGridV2({products,wishedProducts=[]}) {


  const [list, setList] = useState([]);

  useEffect(() => {
    if(products){
      const data = products?.toReversed();
      setList(data);

    }
  })

    return(
        <StyledProductsGrid interval={100}>
                {list?.length > 0 && list.map((product,index) => (
                    // eslint-disable-next-line react/jsx-key
                    <RevealWrapper key={product._id} delay={index*50}>
                        <ProductBox {...product} wished={wishedProducts.includes(product._id)}/>
                    </RevealWrapper>
                ))}
        </StyledProductsGrid>
    );
}