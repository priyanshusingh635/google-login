import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

// Import your local images
const backgroundImage = require('./assets/gym-background.jpg');
const googleLogo = require('./assets/google-logo.png');
const eyeOpenIcon = require('./assets/eye-open-icon.png');
const eyeClosedIcon = require('./assets/eye-closed-icon.png');
const defaultLogo = require('./assets/default-logo.png');

// Backend URL - replace with your actual backend URL
const BACKEND_URL = 'http://192.168.1.100:3000'; // Change this to your backend IP

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: '573005352327-5f3s8p1ri1aof1m818q9k4teuqhq37g5.apps.googleusercontent.com',
  offlineAccess: true,
});

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSigninInProgress, setIsSigninInProgress] = useState(false);

  // Function to handle email/password sign in
  const handleEmailSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      setIsSigninInProgress(true);
      
      const response = await fetch(`${BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Login successful!');
        console.log('Login response:', data);
        // Clear form after successful login
        setEmail('');
        setPassword('');
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert(
        'Connection Error',
        'Unable to connect to the server. Please check your internet connection.'
      );
    } finally {
      setIsSigninInProgress(false);
    }
  };

  // Function to handle Google Sign In
  const handleGoogleSignIn = async () => {
    if (isSigninInProgress) return;
    
    try {
      setIsSigninInProgress(true);
      
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      const response = await fetch(`${BACKEND_URL}/api/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenId: userInfo.idToken,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        Alert.alert('Success', 'Google login successful!');
        console.log('Google login response:', data);
      } else {
        Alert.alert('Authentication failed', data.message || 'Failed to authenticate with Google');
      }
      
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Sign in cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Process in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play services not available');
      } else {
        Alert.alert('Error', error.message || 'An unknown error occurred');
        console.error('Google Sign-In Error:', error);
      }
    } finally {
      setIsSigninInProgress(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.logoContainer}>
            <Image source={defaultLogo} style={styles.logo} />
          </View>

          <Text style={styles.title}>Sign In To Arthlete</Text>
          <Text style={styles.subtitle}>Let's personalize your fitness with AI</Text>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#666"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Image
                    source={showPassword ? eyeOpenIcon : eyeClosedIcon}
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.signInButton, isSigninInProgress && styles.buttonDisabled]}
              onPress={handleEmailSignIn}
              disabled={isSigninInProgress}
            >
              <Text style={styles.signInButtonText}>
                {isSigninInProgress ? 'Signing in...' : 'Sign In →'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.orText}>or</Text>

            <TouchableOpacity
              style={[styles.googleButton, isSigninInProgress && styles.buttonDisabled]}
              onPress={handleGoogleSignIn}
              disabled={isSigninInProgress}
            >
              <Image
                source={googleLogo}
                style={styles.googleIcon}
                resizeMode="contain"
              />
              <Text style={styles.googleButtonText}>
                {isSigninInProgress ? 'Signing in...' : 'Continue with Google'}
              </Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Don't have an account?
                <Text style={styles.signUpText}> Sign Up</Text>
              </Text>
              <TouchableOpacity>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    backgroundImage: {
      flex: 1,
      width: '100%',
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: 20,
    },
    logoContainer: {
      alignItems: 'center',
      marginTop: 40,
    },
    logo: {
      width: 60,
      height: 60,
      resizeMode: 'contain',
    },
    title: {
      fontSize: 24,
      color: 'white',
      textAlign: 'center',
      marginTop: 20,
      fontWeight: 'bold',
      fontFamily: 'System',
    },
    subtitle: {
      fontSize: 16,
      color: '#999',
      textAlign: 'center',
      marginTop: 10,
      fontFamily: 'System',
    },
    inputContainer: {
      marginTop: 30,
      width: '100%',
    },
    inputWrapper: {
      marginBottom: 20,
    },
    label: {
      color: 'white',
      marginBottom: 8,
      fontSize: 16,
      fontFamily: 'System',
    },
    input: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 8,
      padding: 15,
      color: 'white',
      fontSize: 16,
      width: '100%',
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 8,
    },
    passwordInput: {
      flex: 1,
      padding: 15,
      color: 'white',
      fontSize: 16,
    },
    eyeIcon: {
      padding: 15,
    },
    icon: {
      width: 24,
      height: 24,
      tintColor: 'white',
    },
    signInButton: {
      backgroundColor: '#FF6B00',
      borderRadius: 8,
      padding: 15,
      alignItems: 'center',
      marginTop: 20,
    },
    signInButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
      fontFamily: 'System',
    },
    orText: {
      color: 'white',
      textAlign: 'center',
      marginVertical: 20,
      fontFamily: 'System',
    },
    googleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 15,
      marginBottom: 20,
    },
    googleButtonDisabled: {
      opacity: 0.7,
    },
    googleIcon: {
      width: 20,
      height: 20,
      marginRight: 10,
    },
    googleButtonText: {
      color: 'black',
      fontSize: 16,
      fontWeight: '500',
      fontFamily: 'System',
    },
    footer: {
      alignItems: 'center',
      marginTop: 20,
    },
    footerText: {
      color: 'white',
      fontSize: 14,
      marginBottom: 10,
      fontFamily: 'System',
    },
    signUpText: {
      color: '#FF6B00',
    },
    forgotPasswordText: {
      color: '#FF6B00',
      fontSize: 14,
      fontFamily: 'System',
     
    },
  }),
  
  buttonDisabled: {
    opacity: 0.7,
  },
});

export default LoginScreen;