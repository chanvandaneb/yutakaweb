import {ScaleLoader} from "react-spinners";
import styled from "styled-components";

const Wrapper = styled.div`
  ${props => props.fullWidth ? `
    display:block;
    display:flex;
    justify-content:center;
  ` : `
    border: 5px solid blue;
  `}
`;
export default function Spinner({fullWidth}) {
    return (
        <Wrapper fullWidth={fullWidth}>
            {/*<BounceLoader speedMultiplier={3} color={'#555'}/>*/}
            <ScaleLoader speedMultiplier={3} color={'#36d7b7'}/>
        </Wrapper>
    );
}