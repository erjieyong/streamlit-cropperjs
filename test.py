import streamlit as st
from streamlit_cropperjs import streamlit_cropperjs

pic = st.camera_input("Upload a picture", key="uploaded_pic")
if pic:
    pic = pic.read()
    cropped_pic = streamlit_cropperjs(pic=pic, btn_text="Detect!", key="foo")
    if cropped_pic:
        st.image(cropped_pic, output_format="PNG")
