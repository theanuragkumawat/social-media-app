import { useEffect, useState } from "react";
import { Search, CircleX, Loader } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import axios from "../utils/api";
import { Link } from "react-router";

const SearchSheet = ({ isSearchSheetOpen, setIsSearchSheetOpen }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  //   console.log(query);

  useEffect(() => {
    setLoading(true);

    // 1. Create a controller
    const controller = new AbortController();
    const fetchUsers = async () => {
      if (!query.trim()) {
        setSearchResults([]);
        setLoading(false);
        return;
      }
      try {
        console.log("APi call Triggered for query:", query);
        const response = await axios({
          url: `/users/search-users?search=${query}`,
          //   query : { search: query },
          method: "get",
          signal: controller.signal,
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(response);
        setSearchResults(response.data.data.docs);
      } catch (error) {
        // 3. Ignore errors caused by cancellation
        if (error.name !== "CanceledError") {
          console.error("Search failed", error);
        }
      } finally {
        setLoading(false);
      }
    };

    // Debounce: Wait 500ms before calling API
    const timeoutId = setTimeout(() => {
      fetchUsers(); //SECOND
    }, 500);

    //   4. Cleanup function
    return () => {
      clearTimeout(timeoutId); // Cancel the timer FIRST
      controller.abort(); // Cancel the API call if it's still running
    };
  }, [query]);

  return (
    <Sheet
      className={""}
      open={isSearchSheetOpen}
      onOpenChange={() => setIsSearchSheetOpen(!isSearchSheetOpen)}
      modal={false}
    >
      <SheetContent
        side="left"
        className={
          "[&>button:first-of-type]:hidden sm:min-w-[450px] bg-background shadow-none rounded-2xl"
        }
      >
        <SheetHeader>
          <SheetTitle>
            <div className="px-5 mt-2">
              <h2 className="font-bold text-2xl">Search</h2>
            </div>
          </SheetTitle>
          <SheetDescription></SheetDescription>
          <div className="px-2.5">
            <div className="px-2 mt-6 relative flex flex-row justify-center items-center rounded-3xl bg-neutral-800">
              {!isSearchFocused && (
                <div className="flex justify-center items-center pl-2">
                  <Search
                    size={15}
                    className=" text-neutral-400 pointer-events-none"
                  />
                </div>
              )}

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                autoFocus={false}
                placeholder="Search"
                className=" outline-none w-full py-2 pl-1.5 pr-3.5 text-base text-white placeholder:text-[15px] placeholder:text-neutral-400 placeholder:tracking-tight"
                type="text"
              />
              {loading ? (
                <Loader
                  size={19}
                  className="motion-safe:animate-spin text-neutral-200 pointer-events-none mr-1.5"
                />
              ) : (
                isSearchFocused && (
                  <div
                    className="cursor-pointer"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setQuery("");
                    }}
                  >
                    <CircleX
                      size={19}
                      className="text-neutral-900 fill-neutral-200 pointer-events-none mr-1.5"
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </SheetHeader>
        {query.length == 0 && (
          <div className="px-9">
            <div>
              <div className="flex flex-row justify-between items-center">
                <p className="font-bold text-sm dark:text-white">Recent</p>
                <button className="font-bold text-sm dark:text-sky-400 cursor-pointer">
                  Clear all
                </button>
              </div>
            </div>
          </div>
        )}
        {searchResults && searchResults.length !== 0 && !loading && (
          <>
            <div className="px-5 overflow-y-auto">
              {searchResults?.map((item) => {
                return (
                  <Link
                    to={`/${item.username}`}
                    key={item._id}
                    className="active:scale-97 duration-75 w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-800 transition cursor-pointer rounded-2xl"
                  >
                    {/* Avatar */}
                    <img
                      src={
                        item.avatar
                          ? item.avatar
                          : "https://i.pinimg.com/200x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"
                      }
                      alt={item.fullname}
                      className="w-10 h-10 rounded-full object-cover"
                    />

                    {/* Text */}
                    <div className="flex flex-col leading-tight">
                      <span className="text-sm font-semibold text-white">
                        {item.fullname}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {item.username}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
        {/* skeleton */}
        {loading && (
          <div className="px-5 overflow-y-auto">
            {Array.from({ length: 12}).map((_,index) => (
              <div key={index} className=" w-full flex items-center gap-3 px-4 py-3 rounded-2xl animate-pulse">
                <div className="size-10 shrink-0 box-border bg-neutral-800 rounded-full"></div>
                <div className="flex flex-col w-full">
                  <div className="w-5/6 h-3 bg-neutral-800 rounded "></div>
                  <div className="w-3/5 h-3 bg-neutral-800 rounded mt-1"></div>
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && query.trim().length != 0 && searchResults.length == 0 && (
          <div className="px-10 text-center text-neutral-300 h-lvh flex justify-center items-center text-sm">
            No Users Found.
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default SearchSheet;
