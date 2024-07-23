import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios'; // Assuming backend API interaction
import { useNavigate, useParams } from 'react-router-dom';
import AuthNav from '../AuthNav';

function ValidatingOtp() {
    const navigate = useNavigate();
  const { id } = useParams();
  const [otp, setOtp] = useState('');
  const [check, setCheck] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Assuming you have a way to retrieve the email used for registration/login
  const [userEmail, setUserEmail] = useState(''); // Replace with your logic

  const handleSubmit = async () => {  
    console.log(userEmail);
    setIsLoading(true);
    setError(null); // Clear any previous errors

    console.log("1");
    axios.post(`http://localhost:5000/validate-otp/${id}`, {
      otp: otp,
      email: userEmail, // Pass the email for verification
    }).then((res) => {
      if (res.status === 200) {
        setIsLoading(false);
        console.log("2");
        setSuccess(true);
        console.log('OTP verified successfully!');
        navigate(`setup-profile/${id}`);
        // Handle successful authentication (e.g., navigate to main app)
      } else {
        setError('Invalid OTP. Please try again.');
      }
    })
    .catch((err) => {
      console.log(err);
    })
  };

  useEffect(() => { 
    axios.get(`http://localhost:5000/email/${id}`)
    .then((res) => {
        console.log(res.data);
        setUserEmail(res.data);
        console.log(userEmail);
    })
    .catch((err) => {
        console.log(err);
    })
  }, [id]); // Empty dependency array to run only once on component mount

  return (
    // <View style={styles.container}>
    //   <AuthNav />
    //   <h1 style={styles.h1}>Validating OTP</h1>
    //   <Text style={styles.text}>
    //     Please check your email inbox for the OTP sent to {userEmail}.
    //   </Text>
    //   <TextInput
    //     style={styles.textInput}
    //     placeholder="Enter OTP"
    //     value={otp}
    //     onChangeText={setOtp} // Concise way to set OTP state
    //     keyboardType="numeric" // Set keyboard type for numbers
    //     maxLength={6} // Assuming a 6-digit OTP
    //   />
    //   {error && <Text style={styles.errorText}>{error}</Text>}
    //   <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
    //     <Text style={styles.submitText}>{isLoading ? 'Loading...' : 'Submit'}</Text>
    //   </TouchableOpacity>
    //   {success && <Text style={styles.successText}>OTP verified successfully!</Text>}
    // </View>
    <>
      <div className="container">
        <h1 className="h1">Validating OTP</h1>
        <p className="text">
            Please check your email inbox for the OTP sent to {userEmail}.
        </p>
        <form onSubmit={handleSubmit}>
            <input
                className="textInput"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)} // Concise way to set OTP state
                keyboardType="numeric" // Set keyboard type for numbers
                maxLength={6} // Assuming a 6-digit OTP
            />
            {error && <p className="errorText">{error}</p>}
            <button type="submit" className="submitButton" disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Submit'}
            </button>
        </form>
        {success && <p className="successText">OTP verified successfully!</p>}
      </div>
    </>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     padding: 20,
//   },
//   h1: {
//     fontSize: 30,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   text: {
//     fontSize: 20,
//     marginBottom: 20,
//   },
//   textInput: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     fontSize: 18,
//     marginBottom: 10,
//   },
//   errorText: {
//     color: 'red',
//     marginBottom: 10,
//   },
//   submitButton: {
//     backgroundColor: '#007bff',
//     padding: 10,
//     borderRadius: 5,
//   },
//   submitText: {
//     color: '#fff',
//     fontSize: 18,
//     textAlign: 'center',
//   },
//   successText: {
//     color: 'green',
//     fontSize: 18,
//     marginTop: 10,
//   },
// });

export default ValidatingOtp;
