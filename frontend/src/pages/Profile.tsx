
import { ProfileForm } from "../components/ProfileForm";

export default function ProfilePage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
  
      
      <div className="w-full flex justify-center">
        <div className="w-full max-w-9/10">
          <ProfileForm user={user} />
        </div>
 
        </div> 
  );
}