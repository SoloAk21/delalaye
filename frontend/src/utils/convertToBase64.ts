

export default function convertToBase64(file:File):Promise<string>{
return new Promise((resolve,reject)=>{
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        if (typeof reader.result === 'string') {
            resolve(reader.result);
        } else {
            reject(new Error('Failed to convert the file to base64.'));
        }
    };
    reader.onerror = error => reject(error);
})
}