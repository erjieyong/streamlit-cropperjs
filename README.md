# Streamlit-cropperjs

Integrating the amazing [cropperjs](https://github.com/fengyuanchen/cropperjs) with streamlit. 

This streamlit module is primarily built with mobile usage in mind.

![](https://github.com/erjieyong/streamlit-cropperjs/blob/main/streamlit-cropperjs-demo.gif)
## Demo
Access the demo app here: [https://st-cropperjs.streamlit.app/](https://st-cropperjs.streamlit.app/)

## Installation
`pip install streamlit-cropperjs`

## Example
```
import streamlit as st

from streamlit_cropperjs import st_cropperjs

pic = st.file_uploader("Upload a picture", key="uploaded_pic")
if pic:
    pic = pic.read()
    cropped_pic = st_cropperjs(pic=pic, btn_text="Detect!", key="foo")
    if cropped_pic:
        st.image(cropped_pic, output_format="PNG")
```
## Features
- Crop and return image data
- Supports touch (mobile)
- Supports cropping on demand with a button (customised button text)

## Future Development
- Support for all cropperjs options
- Support for cropperjs v2

## References
[https://github.com/fengyuanchen/cropperjs](https://github.com/fengyuanchen/cropperjs)
