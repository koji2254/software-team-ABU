document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('video-feed');
    const captureButton = document.getElementById('capture-btn');
    const onCameraButton = document.getElementById('on-camera');
    const offCameraButton = document.getElementById('off-camera');
    const capturedImage = document.getElementById('captured-image');
    const capturedImageContainer = document.getElementById('captured-image-container');
 
    let mediaStream = null;
 
    
     const randomId = () => {
         // Generate a random number between 1000000000 and 9999999999
         return Math.floor(Math.random() * (9999999999 - 1000000000 + 1)) + 1000000000;
     };
  
 
    // Function to turn on the camera
    function turnOnCamera() {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                video.style.transform = "scaleX(-1)"
             //    mediaStream = stream;
                video.srcObject = stream;
                
                video.play();
            })
            .catch(error => console.error('Error accessing camera:', error));
    }
 
    // Function to turn off the camera
    function turnOffCamera() {
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            video.srcObject = null;
        }
    }
 
    // Function to capture image
 
 //    function captureImage() {
 //        const canvas = document.createElement('canvas');
 //        canvas.width = video.videoWidth;
 //        canvas.height = video.videoHeight;
 
 //       const ctx = canvas.getContext('2d');
 
 //       // Draw the video frame onto the canvas
 //       ctx.save();
 //       ctx.scale(-1, 1); // Flip horizontally
 //       ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
 //       ctx.restore();
   
 //        const imageDataURL = canvas.toDataURL('image/jpeg');
 
 //        // Display the captured image
 //        capturedImage.src = imageDataURL;
 
 //        const formData = new FormData()
 //        const timeStamp = new Date().toISOString() 
        
 //        formData.append('imageFile', imageDataURL)
 //        formData.append('timeStamp', timeStamp)
 
 //     //    console.log(formData)
 //        sendImageToBackend(imageDataURL);
 //    }
 
    // Send image data to the backend
    
    function captureImage() {
     const canvas = document.createElement('canvas');
     canvas.width = video.videoWidth;
     canvas.height = video.videoHeight;
 
     const ctx = canvas.getContext('2d');
 
     // Draw the video frame onto the canvas
     ctx.save();
     ctx.scale(-1, 1); // Flip horizontally
     ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
     ctx.restore();
 
     const imageDataURL = canvas.toDataURL('image/jpeg');
     // Convert data URL to Blob
 
     const blob = dataURLtoBlob(imageDataURL);
     // Display the captured image
 
     // Create a File object from the Blob
     const imageFile = new File([blob], `${randomId()}.jpg`, { type: 'image/jpeg' });
    
     capturedImage.src = imageDataURL;
 
     const timeStamp = new Date().toISOString();
     captureImage.src = imageFile
 
     // Create FormData and append File and timestamp
     const formData = new FormData();
 
     formData.append('file', imageFile);
     formData.append('id', timeStamp);
 
     // formData.forEach((index, item) => {
     //     console.log(`${item}:${index}` )
     // })
 
     sendImageToBackend(formData);
 }
 
     // Function to convert data URL to Blob
     function dataURLtoBlob(dataURL) {
         const byteString = atob(dataURL.split(',')[1]);
         const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
         const ab = new ArrayBuffer(byteString.length);
         const ia = new Uint8Array(ab);
         for (let i = 0; i < byteString.length; i++) {
             ia[i] = byteString.charCodeAt(i);
         }
         return new Blob([ab], { type: mimeString });
     }
    
    const sendImageToBackend = async(formData) => {
        try {      
             let nums = {
                 one: 'one',
                 two: 'TWO TWO'
             }
 
         //    const response = await fetch('http://localhost:5500/api/upload', {
         //        method: 'POST',
         //        headers: {
         //             'Accept' : 'Application/json',
         //             // 'Content-Type': 'multipart/form-data'
         //        },
         //        body: JSON.stringify(nums)
         //    });
         //     const data = await response.json();
         //     console.log(data)
     
             const config = {
                 headers: {
                     'Content-Type': 'multipart/form-data'
                 }
             }
 
             const { data } = await axios.post('http://localhost:5500/api/upload', formData, config)
 
             console.log(data)
   
        } catch (error) {
            console.error('Error sending image to backend:', error);
         //    console.log(data)
        }
    }
 
    // Event listener for the capture button
    captureButton.addEventListener('click', captureImage);
 
    // Event listener for turning on the camera button
    onCameraButton.addEventListener('click', turnOnCamera);
 
    // Event listener for turning off the camera button
    offCameraButton.addEventListener('click', turnOffCamera);
 
    // Turn on the camera by default
    turnOnCamera();
 });