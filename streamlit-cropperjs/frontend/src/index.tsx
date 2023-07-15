import Cropper from "cropperjs";
import { RenderData, Streamlit } from "streamlit-component-lib";

// Add text and a button to the DOM. (You could also add these directly
// to index.html.)
const div = document.body.appendChild(document.createElement("div"))
div.style.display = 'block';
const img = div.appendChild(document.createElement("img"))
// div.appendChild(document.createElement("br"))
const button = div.appendChild(document.createElement("button"))
const link = document.head.appendChild(document.createElement("link"))
link.rel = "stylesheet";
link.href = "https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css";
// const script = document.head.appendChild(document.createElement("script"))
// script.src = "https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js"

button.textContent = "Detect!"

// Add a click handler to our button. It will send data back to Streamlit.
let numClicks = 0
let isFocused = false
// button.onclick = function(): void {
//   // Increment numClicks, and pass the new value back to
//   // Streamlit via `Streamlit.setComponentValue`.
//   numClicks += 1
//   Streamlit.setComponentValue(numClicks)
// }

button.onfocus = function(): void {
  isFocused = true
}

button.onblur = function(): void {
  isFocused = false
}

function base64ToArrayBuffer(base64: string) {
  var binaryString = atob(base64);
  var bytes = new Uint8Array(binaryString.length);
  for (var i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * The component's render function. This will be called immediately after
 * the component is initially loaded, and then again every time the
 * component gets new data from Python.
 */
function onRender(event: Event): void {
  // Get the RenderData from the event
  const data = (event as CustomEvent<RenderData>).detail

  // Maintain compatibility with older versions of Streamlit that don't send
  // a theme object.
  if (data.theme) {
    // Use CSS vars to style our button border. Alternatively, the theme style
    // is defined in the data.theme object.
    const borderStyling = `1px solid var(${
      isFocused ? "--primary-color" : "gray"
    })`
    button.style.border = borderStyling
    button.style.outline = borderStyling
  }

  // Disable our button if necessary.
  button.disabled = data.disabled

  // RenderData.args is the JSON dictionary of arguments sent from the
  // Python script.
  let pic = data.args["pic"]
  // convert the pic into uint8array
  let arrayBufferView = new Uint8Array(pic);
  // display the image
  img.src = URL.createObjectURL(
    new Blob([arrayBufferView], { type: 'image/png' } /* (1) */)
  );
  // img.style.maxHeight = "90%"
  img.style.maxWidth = "100%"
  img.id = data.args["key"]
  img.style.display = "block"
  // img.style.objectFit = "contain"
  
  // Cropper.js
  var cropper = new Cropper(img, {
    autoCropArea: 0.5,
    viewMode: 0,
    guides: false,
    rotatable: false,
    ready: function (){
      button.addEventListener('click', function() {
        //  FIX THIS. CURRENTLY ON 2nd CLICK, IT WILL OUTPUT ERROR!!
        var croppedImage = cropper.getCroppedCanvas().toDataURL("image/png");
    
        // img2.src=croppedImage;
        // Streamlit.setFrameHeight()
      //   // console.log(croppedImage)
      //   // var croppedImageByte = URL.createObjectURL(
      //   //   new Blob([croppedImage], { type: 'image/png' } /* (1) */)
      //   // );
      //   // console.log(croppedImageByte)
        Streamlit.setComponentValue(croppedImage)
      })
    }
  });



  

  // We tell Streamlit to update our frameHeight after each render event, in
  // case it has changed. (This isn't strictly necessary for the example
  // because our height stays fixed, but this is a low-cost function, so
  // there's no harm in doing it redundantly.)
  // wait for image to load finish first before runnning setFrameHeight
  window.addEventListener("load", event => {
    if (img.complete && img.naturalHeight !== 0){
      Streamlit.setFrameHeight()
    }
  })
}

// Attach our `onRender` handler to Streamlit's render event.
Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onRender)

// Tell Streamlit we're ready to start receiving data. We won't get our
// first RENDER_EVENT until we call this function.
Streamlit.setComponentReady()

// Finally, tell Streamlit to update our initial height. We omit the
// `height` parameter here to have it default to our scrollHeight.
Streamlit.setFrameHeight()
