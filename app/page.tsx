"use client";
import { KeyboardEventHandler, useState } from "react";
import { challengeData } from "./data/challenge_data";
import { ChallengeData } from "./types/ChallengeData";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 10; // Number of items per page

  // Filtered data based on search query
  const filteredData = challengeData.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate number of columns based on currentItems
  const numColumns =
    currentItems.length > 0
      ? Math.min(Math.ceil(currentItems.length / 2), 5)
      : 1;

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  //Add new images
  const handleAddImage = (title: string, description: string, file: File) => {
    challengeData.push({ title, description, imagePath: file.name });
  };

  return (
    <div className="flex flex-col h-screen w-full gap-10 bg-slate-950 py-4">
      <div className="flex w-full justify-center items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-4 m-2 border rounded-md bg-slate-600 border-slate-600 focus:border-gray-400 text-xl focus:outline-none"
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="ml-2 px-4 py-2 bg-gray-800 text-white rounded-md"
        >
          Add Image
        </button>
      </div>
      {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}

      <div className="flex-grow">
        <div
          className={
            currentItems.length > 0
              ? `grid grid-cols-5 sm:grid-cols-${numColumns} gap-4 p-20`
              : "flex flex-grow items-center justify-center gap-4 p-20"
          }
        >
          {currentItems.length > 0 ? (
            currentItems.map((data, index) => (
              <GridItem key={index} item={data} />
            ))
          ) : (
            <div className="flex flex-grow items-center justify-center">
              <NoMatches />
            </div>
          )}
        </div>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center">
        {Array.from(
          { length: Math.ceil(filteredData.length / itemsPerPage) },
          (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`p-2 mx-1 ${
                currentPage === i + 1
                  ? "bg-gray-800 text-white"
                  : "text-gray-600"
              } hover:bg-gray-200 hover:text-gray-800 rounded-md transition duration-300`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
}

interface GridItemProps {
  item: ChallengeData;
}
const GridItem: React.FC<GridItemProps> = ({ item }) => {
  const [isHovering, setIsHovering] = useState<boolean>();
  return (
    <div
      className="relative w-full hover:shadow cursor-pointer  hover:shadow-slate-200 rounded-lg"
      style={{ paddingBottom: "100%" }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <img
        src={item.imagePath}
        alt={item.description}
        className="absolute inset-0 object-cover w-full h-full rounded-lg "
      />
      {isHovering && (
        <div className="absolute inset-0 flex flex-col justify-around items-center">
          <h2 className="text-slate-100 text-xl font-semibold mb-2">
            {item.title}
          </h2>
          <p className="text-gray-200 text-md">{item.description}</p>
        </div>
      )}
    </div>
  );
};

const NoMatches: React.FC = () => {
  return (
    <div className="flex items-center justify-center text-xl text-gray-600">
      No matches
    </div>
  );
};

const Modal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const handleOnClose: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === "Escape") onClose();
  };
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10"
      onKeyUp={handleOnClose}
    >
      <div className="bg-slate-700 p-6 rounded-lg w-1/3 z-20">
        <div className="flex justify-between w-full">
          <h2 className="text-xl font-semibold mb-4 text-slate-100">
            Add Image
          </h2>
          <p
            className="text-xl font-semibold mb-4 text-slate-100 cursor-pointer"
            onClick={onClose}
          >
            X
          </p>
        </div>
        <ImageForm onClose={onClose} />
        {/* Pass your actual onAddImage function */}
      </div>
    </div>
  );
};

const ImageForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imagePath, setImagePath] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    challengeData.splice(0, 0, { title, description, imagePath });
    // Clear form fields
    setTitle("");
    setDescription("");
    setImagePath("");
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col">
        <label htmlFor="title" className="text-white">
          Title:
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="p-2 rounded-md bg-gray-800 text-white"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="description" className="text-white">
          Description:
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="p-2 rounded-md bg-gray-800 text-white"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="file" className="text-white">
          Image Path:
        </label>
        <input
          type="text"
          id="imagePath"
          value={imagePath}
          onChange={(e) => setImagePath(e.target.value)}
          required
          className="p-2 rounded-md bg-gray-800 text-white"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-800 text-white rounded-md"
      >
        Submit
      </button>
    </form>
  );
};
