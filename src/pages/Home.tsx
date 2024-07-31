import { OLMap } from '@/features/map';
import { Alert, AlertIcon } from '@chakra-ui/react';
import './Home.css';

const Home = () => (
  <>
    <Alert status="success">
      <AlertIcon />
      You finally made it!
    </Alert>
    <OLMap />
  </>
);

export default Home;
