import ImageKit from "imagekit";

export const IMAGEKIT_URL_ENDPOINT = "https://ik.imagekit.io/mvdxamk9c/";
export const IMAGEKIT_PUBLIC_KEY = "public_b//B6Hm8yRUbW2S/IvdrFx6ege8=";

const imagekit = new ImageKit({
  publicKey: IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY!, // This should go in the backend, sorry :(
  urlEndpoint: IMAGEKIT_URL_ENDPOINT,
});

export const uploadImage = async (file: string | Buffer, fileName: string) => {
  return await imagekit.upload({
    file,
    fileName,
  });
};
