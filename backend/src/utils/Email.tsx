
import React from 'react'
import { Row } from '@react-email/row';
import { Column } from '@react-email/column';
import { Html } from '@react-email/html';
import { Heading } from '@react-email/heading';
import { Button } from '@react-email/button';
import { Container } from '@react-email/container';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import { Hr} from "@react-email/hr";
import { User } from './sendEmail';
export interface EmailProps {
  fullName:string
}
const ApprovalEmail:React.FC<EmailProps> = ({fullName}) => {
  return (
 <>
 <Html>
    <Container>
      <Section>
      <Text>Welcome {fullName}, Thank you for registering!</Text>
<Hr></Hr>
      <Text> Your account on delalaye app is aproved.</Text>
<Hr></Hr>
  
 
      </Section>

 
     <Section>
     <Text>If you encounter any issues or have any questions, please feel free to reach out to our support team at  <Button  href="mailto:support@delalaye.com" style={{ color: "#01890d" }}>
    support@delalaye.com
  </Button>.</Text>
    </Section>
 
    </Container>
</Html>
 </>
   
  );
};



interface ResetEmailProp {
  userName:string
  link:string
  expirationDate:Date
}
export const PasswordResetEmail:React.FC<ResetEmailProp> = ({userName,link,expirationDate}) => {


  const formattedDate = `${expirationDate.toLocaleDateString()} ${expirationDate.toLocaleTimeString()}`;
  return (
 <>
 <Html>
    <Container>
      <Heading as='h2'>Password Reset</Heading>
      <Section>

      <Text>Hi {userName}</Text>
      <Text>Click the following link to reset your password.</Text>
     <Button href={`https://abronet.net/reset-password?token=${link}`}>Reset password</Button>
      <Text>This link will expire on {formattedDate}</Text>
<Hr></Hr>
      </Section>

 <Section>
  <Text>
  The Abronet Team.
  </Text>
 </Section>
    </Container>
</Html>
 </>
   
  );
}; 


     
      export default ApprovalEmail;