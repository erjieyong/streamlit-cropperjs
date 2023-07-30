import base64
import os
from io import BytesIO

import streamlit as st
import streamlit.components.v1 as components

# Create a _RELEASE constant. We'll set this to False while we're developing
# the component, and True when we're ready to package and distribute it.
# (This is, of course, optional - there are innumerable ways to manage your
# release process.)
_RELEASE = True

# Declare a Streamlit component. `declare_component` returns a function
# that is used to create instances of the component. We're naming this
# function "_st_cropperjs", with an underscore prefix, because we don't want
# to expose it directly to users. Instead, we will create a custom wrapper
# function, below, that will serve as our component's public API.

# It's worth noting that this call to `declare_component` is the
# *only thing* you need to do to create the binding between Streamlit and
# your component frontend. Everything else we do in this file is simply a
# best practice.

if not _RELEASE:
    _st_cropperjs = components.declare_component(
        # We give the component a simple, descriptive name ("st_cropperjs"
        # does not fit this bill, so please choose something better for your
        # own component :)
        "st_cropperjs",
        # Pass `url` here to tell Streamlit that the component will be served
        # by the local dev server that you run via `npm run start`.
        # (This is useful while your component is in development.)
        url="http://localhost:3001",
    )
else:
    # When we're distributing a production version of the component, we'll
    # replace the `url` param with `path`, and point it to to the component's
    # build directory:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/build")
    _st_cropperjs = components.declare_component("st_cropperjs", path=build_dir)


# Create a wrapper function for the component. This is an optional
# best practice - we could simply expose the component function returned by
# `declare_component` and call it done. The wrapper allows us to customize
# our component's API: we can pre-process its input args, post-process its
# output value, and add a docstring for users.
def st_cropperjs(pic, btn_text, key=None):
    """Create a new instance of "st_cropperjs".

    Parameters
    ----------
    pic: bytes
        The image file that you want to crop. It should be in bytes format
    btn_text: str
        A custom name for the crop button
    key: str or None
        An optional key that uniquely identifies this component. If this is
        None, and the component's arguments are changed, the component will
        be re-mounted in the Streamlit frontend and lose its current state.

    Returns
    -------
    bytes
        The cropped image file in bytes format

    """
    # Call through to our private component function. Arguments we pass here
    # will be sent to the frontend, where they'll be available in an "args"
    # dictionary.
    #
    # "default" is a special argument that specifies the initial return
    # value of the component before the user has interacted with it.
    # cropped_pic is returned as a base64 image in string format
    cropped_pic = _st_cropperjs(pic=pic, btn_text=btn_text, key=key, default=None)

    if cropped_pic:
        cropped_pic_base64 = base64.b64decode(
            cropped_pic.split("data:image/png;base64,")[1]
        )

        cropped_pic_bytes = BytesIO(cropped_pic_base64).getvalue()

        return cropped_pic_bytes


# Add some test code to play with the component while it's in development.
# During development, we can run this just as we would any other Streamlit
# app: `$ streamlit run st_cropperjs/__init__.py`
if not _RELEASE:
    st.subheader("Streamlit-Cropperjs")
    pic = st.file_uploader("Upload a picture", key="uploaded_pic")
    if pic:
        pic = pic.read()
        cropped_pic = st_cropperjs(pic=pic, btn_text="Detect!", key="foo")
        if cropped_pic:
            st.image(cropped_pic, output_format="PNG")
            st.download_button(
                "Download", cropped_pic, file_name="output.png", mime="image/png"
            )
