import Form from "next/form"
import SearchFormReset from "./SearchFormReset"
import { Search } from "lucide-react"
import SearchFormFocus from "./SearchFormFocus"

const SearchForm = ({ query }: { query?: string }) => {
  return (
    <div>
      <Form action="/" scroll={false} className="search-form">
        <input id="search" name="query" defaultValue={query} className="search-input" placeholder="Search Startups" />

        <div className="flex gap-2">
          {query && <SearchFormReset />}

          <button type="submit" className="search-btn text-white">
            <Search className="size-5" />
            <span className="sr-only">Search Button</span>
          </button>
        </div>
      </Form>
      <SearchFormFocus />
    </div>
  )
}

export default SearchForm
