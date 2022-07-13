import Nav from "../components/Nav"
import "../styles/index.css"
import { Toaster } from "react-hot-toast"
import { UserContext } from "../lib/context"
import { useUserData } from "../lib/hook"
import { ChakraProvider, Container } from "@chakra-ui/react";

function MyApp({ Component, pageProps }) {
  const userData = useUserData();

  return (
    <ChakraProvider>
      <UserContext.Provider value={userData}>
        <Nav />
        <Container maxW={"container.xl"} py={"10"}>
          <Component {...pageProps} />
        </Container>
        <Toaster />
      </UserContext.Provider>
    </ChakraProvider>
  )
}

export default MyApp