import PhotoAlbum, {
  RenderPhotoProps
} from "react-photo-album";
import PageOverlay from "../PageOverlay";
import Image from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Toast } from "../shared/Toast";

export default function ImageGallery({
  imageSources,
  galleryIsShowing,
  setGalleryIsShowing,
  slug,
}: {
  imageSources: string[];
  galleryIsShowing: boolean;
  setGalleryIsShowing: (state: boolean) => void;
  slug: string;
}) {
  // TODO: Make proper responsive breakpoint sizes
  const photos = imageSources.map((src, 
    ) => {
    return {
      src: src,
      width: 900,
      height: 600,
    };
  });

  const [index, setIndex] = useState(-1);
  const [showNotification, setShowNotification] = useState(false);

  const triggerNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 2000);
  };

  return (
    <>
      <PageOverlay
        open={galleryIsShowing}
        setOpen={setGalleryIsShowing}
        triggerNotification={triggerNotification}
        slug={slug}
      >
        <div className="relative mx-auto h-full max-w-5xl">
          <Toast show={showNotification} message="Link Copied!" />

          <PhotoAlbum
            layout="rows"
            photos={photos}
            defaultContainerWidth={1000}
            targetRowHeight={300}
            componentsProps={{
              imageProps: {
                className:
                  "cursor-pointer hover:brightness-90 transition duration-100",
              },
            }}
            renderPhoto={RenderPhoto}
            // rowConstraints={{maxPhotos: 2}}
            onClick={({ index: current }) => setIndex(current)}
          />
        </div>
      </PageOverlay>

      <Lightbox
        index={index}
        slides={photos}
        open={index >= 0}
        close={() => setIndex(-1)}
      />
    </>
  );
}

const RenderPhoto = ({
  photo,
  imageProps: { alt, title, sizes, className, onClick },
  wrapperStyle,
  // layout: { index },
}: RenderPhotoProps) => {
  return (
    <div style={{ ...wrapperStyle, position: "relative" }}>
      <Image
        fill
        src={photo}
        placeholder={"blurDataURL" in photo ? "blur" : undefined}
        {...{ alt, title, sizes, className, onClick }}
        // sizes={index % 3 == 0 ? "50vw" : "25vw"}
      />
    </div>
  );
};
