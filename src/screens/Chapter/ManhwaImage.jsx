const ManhwaImage = ({ uri }) => {
    const [height, setHeight] = React.useState(windowWidth); // Default tinggi sementara

    return (
        <Image
            source={{ uri }}
            style={{
                width: windowWidth,
                height: height,
            }}
            // Menghitung tinggi asli saat gambar berhasil dimuat
            onLoad={(event) => {
                const { width, height: originalHeight } = event.nativeEvent.source;
                const scaledHeight = (windowWidth / width) * originalHeight;
                setHeight(scaledHeight);
            }}
            resizeMode="contain"
        />
    );
};