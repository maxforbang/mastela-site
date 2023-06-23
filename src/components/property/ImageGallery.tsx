import PhotoAlbum, {
  RenderPhotoProps,
  RenderRowContainer,
} from "react-photo-album";
import PageOverlay from "../PageOverlay";
import Image from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

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
  const photos = imageSources.map((src, index) => {
    return {
      src: src,
      width: 900,
      height: 600,
    };
  });

  const [index, setIndex] = useState(-1);

  return (
    <>
      <PageOverlay
        open={galleryIsShowing}
        setOpen={setGalleryIsShowing}
        slug={slug}
      >
        <div className="relative mx-auto h-full max-w-5xl">
          <PhotoAlbum
            layout="rows"
            photos={[...photos, ...photos, ...photos]}
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
  layout: { index },
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

const RenderRow: RenderRowContainer = ({
  rowContainerProps,
  rowIndex,
  rowsCount,
  children,
}) => {
  console.log(rowContainerProps);
  return (
    <>
      <div {...rowContainerProps}>{children}</div>
    </>
  );
};
