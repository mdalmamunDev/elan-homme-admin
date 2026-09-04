import { Empty } from "antd";
import { cn } from "../lib/utils";
import { Discuss, RotatingLines } from "react-loader-spinner";

const LoaderWraperComp = ({
  isLoading,
  isError,
  className,
  loader,
  dataEmpty = false,
  children,
}) => {
  if (isLoading || isError || dataEmpty) {
    return (
      <div
        className={cn(
          `h-[50vh] w-full flex flex-col justify-center items-center`,
          className
        )}
      >
        {isLoading ? (
          <>
            {loader || (
              <Discuss
                visible={true}
                height="80"
                width="80"
                ariaLabel="discuss-loading"
                wrapperStyle={{}}
                wrapperClass="discuss-wrapper"
                color="#e8bd56" // Set your desired color here
              />
            )}
          </>
        ) : isError ? (
          <h1 className="text-red-400">Something want wrong!</h1>
        ) : (
          <h1 className="text-green-400">
            {isError ? isError : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
          </h1>
        )}
      </div>
    );
  }
  return children;
};

export default LoaderWraperComp;
