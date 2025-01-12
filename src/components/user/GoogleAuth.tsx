import {CredentialResponse, GoogleLogin} from "@react-oauth/google";
import { userGoogleAuth } from '../../services/user/AuthServices'
import { advisorGoogleAuth } from "../../services/advisor/AuthServices";
import useShowToast from '../../customHook/showToaster'
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface GoogleAuthProps{
  role: 'user'| 'advisor'
}

const GoogleAuth:React.FC<GoogleAuthProps> = ({role}) => {
    const navigate=useNavigate()
    const Toast=useShowToast()
    const handleGoogle = async (userCredential:CredentialResponse) => {
      try {
        if (userCredential.credential) {
          const user = jwtDecode<any>(userCredential.credential); 
          console.log("Decoded user:", user);
  
          let userData;
          if (role === 'user') {
            userData = await userGoogleAuth(user); 
          } else if (role === 'advisor') {
            userData = await advisorGoogleAuth(user); 
          }
  
          console.log("User data:", userData);
  
          if (userData?.message) {
            Toast(userData.message, 'success', true);
            setTimeout(() => {
              navigate(role === 'advisor' ? "/advisor" : "/");
            }, 1000);
          }
        }
      } catch (error) {
        console.error("Error during Google Auth:", error);
        Toast('Something went wrong, please try again later', 'error', true);
      }
    };
      //   if(userCredential.credential){
      //       const user = jwtDecode(userCredential.credential)
      //       console.log("user : ",user)
      //       const userData= await googleAuth(user)
      //       console.log("userData : ",userData)
      //    if(userData?.message){
      //     if(role==='advisor'){
      //       Toast(userData.message,'success',true)
      //       setTimeout(()=>navigate("/advisor"),1000)
      //     }else{
      //       Toast(userData.message,'success',true)
      //       setTimeout(() => navigate("/"), 1000);
      //     }
      //    }
      //   }
      // };
    return (
        <GoogleLogin
        onSuccess={handleGoogle}
        onError={() => {
         Toast('Something went wrong please try again later','error',true)
        }}
      />
    );
}

export default GoogleAuth;
