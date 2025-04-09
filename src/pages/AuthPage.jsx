import { useRecoilValue } from "recoil";
import SignupCard from "../components/SignupCard";
import authScreenAtom from "../atoms/authAtom";
import LoginCard from "../components/LoginCard";

const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom);
  return <>{authScreenState === "login" ? <LoginCard /> : <SignupCard />}</>;
};

export default AuthPage;
