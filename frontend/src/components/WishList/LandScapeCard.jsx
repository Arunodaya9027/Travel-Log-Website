import {React, useState, useEffect} from "react";
import "./WishList.css"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faSolidHeart } from "@fortawesome/free-solid-svg-icons";

function LandScapeCard({ id,placeName,places,src,history,ticket,timing }) {

  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState([]); // Track wishlist state

  // export const BaseUrl ="http//localhost:5000"
  const handleSubClick = async (e) => {
    e.preventDefault();
    navigate("/subscription");
    // try {
    //   await axios.post(
    //     `${BaseUrl}/subscribe`,
    //     {},
    //     {
    //       headers: { "Content-Type": "application/json" },
    //     }
    //   );
    //   // setFormData()
    //   // console.log(formData)
    //   alert("Email sent successfully");
    // } catch (error) {
    //   console.error("Error sending email:", error);
    //   // alert("Error sending email");
      
    // }
    // alert("Feature Coming soon");
  };

  const handleWishlistClick = async () => {
    try {
      const response = await axios.post(
        `/handle-wishlist/${id}`,
        {}, // Send any relevant data for wishlist management
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200 || response.status === 201) {
        // Success
        setIsWishlisted(!isWishlisted); // Toggle wishlist state
      } else {
        console.error("Error handling wishlist:", response.data);
        // Handle error gracefully (e.g., display an error message)
      }
    } catch (error) {
      console.error("Error handling wishlist:", error);
      // Handle error gracefully (e.g., display an error message)
    }
  };

  useEffect(() => {
    axios.get(`https://localhost:5000/handle-wishlist/${id}`)
    .then((res) => {
      console.log(res.data);
  })
  .catch((err) => {
      console.log(err);
  })
  }, [id]);

  return (
    <div className="landScapeCard" key={id}>
      <span className="imgContainer">
        <img src={src} />
      </span>
      <div className="contentContainer">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1>{placeName}</h1>
          <div style={{ display: "flex", flexDirection: "column", marginLeft: "5%" }}>
            <h5>visit places {places}</h5>
            <h3>{ticket}</h3>
          </div>
        </div>
        <p>{history}</p>
        <h5>Timing</h5>
        <h4>{timing}</h4>
        <FontAwesomeIcon
          icon={isWishlisted ? faSolidHeart : faHeart}
          onClick={handleWishlistClick}
        />
        <h6>
          <a className="moreOption" onClick={handleSubClick}>
            For More Details
          </a>
        </h6>
      </div>
    </div>
  );
}

export default LandScapeCard;
