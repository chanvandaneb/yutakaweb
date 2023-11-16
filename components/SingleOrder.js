import styled from "styled-components";

const StyledOrder = styled.div`
  margin: 10px 0;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
  display: flex;
  gap: 20px;
  align-items: center;
  time{
    font-size: .8rem;
  }
`;

const ProductRow = styled.div`
    
`;

const Address = styled.div`
  font-size: .8rem;
  line-height: 1rem;
  margin-top: 5px;
`;
export default function SingleOrder({line_items,createdAt, ...rest}) {
    return (
        <StyledOrder  className="text-gray-700">
            
            <div>
                <time>{(new Date(createdAt)).toLocaleString('sv-SE')}</time>
                <Address>
                    {rest.name}<br />
                    {rest.email}<br />
                    {rest.streetAddress}<br />
                    {rest.postalCode} {rest.city},{rest.country}
                </Address>
            </div>
            <div>



                {line_items.map(item => (
                    // eslint-disable-next-line react/jsx-key
                    <ProductRow className="text-md text-gray-500 font-semibold">
                        <span>{item.quantity} x  {JSON.stringify(item.price_data.product_data.name)}</span>
                        

                        <span> = Price: {item.quantity * item.price_data.unit_amount / 100} $</span>


                    </ProductRow>
                ))}
            </div>

            
        </StyledOrder>
    );
}