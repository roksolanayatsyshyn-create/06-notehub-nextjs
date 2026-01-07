"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { NoteList } from "@/components/NoteList/NoteList";
import { SearchBox } from "@/components/SearchBox/SearchBox";
import { Pagination } from "@/components/Pagination/Pagination";
import { Modal } from "@/components/Modal/Modal";
import { NoteForm } from "@/components/NoteForm/NoteForm";

import { fetchNotes } from "@/lib/api";
import css from "./NotesPage.module.css";

const PER_PAGE = 12;
export default function NotesClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch] = useDebounce(search, 500);

  const { data } = useQuery({
    queryKey: ["notes", debouncedSearch, page],
    queryFn: () => fetchNotes(debouncedSearch, page, PER_PAGE),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };
  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          {<SearchBox value={search} onChange={handleSearchChange} />}

          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={page}
              onPageChange={setPage}
            />
          )}

          {
            <button className={css.button} onClick={() => setIsModalOpen(true)}>
              Create note +
            </button>
          }
        </header>

        {notes.length > 0 && <NoteList notes={notes} />}
        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <NoteForm onCancel={() => setIsModalOpen(false)} />
          </Modal>
        )}
      </div>
    </>
  );
}
