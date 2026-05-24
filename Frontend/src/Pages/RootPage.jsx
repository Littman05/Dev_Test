import { Navbar } from "../Features"
import { Outlet, useNavigate } from "react-router-dom"
import {useState , useEffect} from "react"
import {useSelector ,  useDispatch} from "react-redux"
import {setLoggedInUserState, selectLoggedInUser} from "../Features/Auth/AuthSlice"
import Cookies from "js-cookie"
import {fetchAllWishlistItemsAsync} from "../Features/Wishlist/WishlistSlice"
import { fetchAllCartItemsAsync } from "../Features/Cart/CartSlice"

export function RootPage(){
  const [searchParameter , setSearchParameter] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loggedInUser = useSelector(selectLoggedInUser)

  useEffect(()=>{
    const user = Cookies.get("loggedInUserInfo")
    if(user){
      dispatch(setLoggedInUserState(JSON.parse(user)))
    }
  },[dispatch])

  useEffect(()=>{
    if(loggedInUser.userId && loggedInUser.role !== "admin"){
      dispatch(fetchAllWishlistItemsAsync({navigate}));
      dispatch(fetchAllCartItemsAsync());
    }
  },[dispatch, loggedInUser.userId, loggedInUser.role, navigate])

  return(
      <div className="min-h-screen animate-delay-none animate-normal">
          <Navbar searchParameter={searchParameter} setSearchParameter={setSearchParameter}/>

          <Outlet/>
      </div>
    )
}
