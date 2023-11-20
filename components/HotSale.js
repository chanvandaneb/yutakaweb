import styled from "styled-components";
import Center from "@/components/Center";
import ProductsGridV2 from "./ProductsGridV2";

const Title = styled.h2`
  font-size: 2rem;
  margin: 30px 0 20px;
  font-weight: normal;
`;

export default function NewProducts({products, wishedProducts}) {
    return(
        <Center>
            <Title>Hot Sale</Title>
            <ProductsGridV2 products={products} wishedProducts={wishedProducts}/>
        </Center>
    );
}