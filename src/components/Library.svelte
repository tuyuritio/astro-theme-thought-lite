<style lang="less">
  main {
    border-color: var(--border-color);
  }

  // Main content area with status rows
  article {
    .status-row {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      h2 {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--primary-color);
        margin-bottom: 0.5rem;
      }

      .books-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 1.5rem;

        .book-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          border-radius: 0.5rem;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          text-decoration: none;

          &:hover {
            background-color: var(--block-color);
            transform: translateY(-2px);
          }

          .book-info {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 0.25rem;
            width: 100%;

            .book-title {
              font-weight: 600;
              color: var(--primary-color);
              font-size: 1rem;
              line-height: 1.4;
            }

            .book-author {
              color: var(--remark-color);
              font-size: 0.875rem;
            }

            .book-progress {
              color: var(--weak-color);
              font-size: 0.75rem;
              font-family: var(--monospace);
            }
          }
        }
      }
    }
  }

  // Sidebar styling
  aside {
    border-color: var(--border-color);

    section {
      display: flex;
      flex-direction: column;
      gap: 5px;

      // Tag filter buttons
      .tag-list {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.5rem;

        button {
          border-bottom: 1px solid var(--primary-color);
          padding: 0.125rem 0.5rem;
          font-size: 0.9rem;
          transition:
            color 0.15s ease,
            background-color 0.15s ease;

          &.selected {
            color: var(--background-color);
            background-color: var(--primary-color);
          }

          &:hover {
            color: var(--background-color);
            background-color: var(--primary-color);
          }
        }
      }

      // Latest activity card
      .activity-card {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 1rem;
        border: 1px solid var(--border-color);
        border-radius: 0.5rem;
        background-color: var(--block-color);
        transition: opacity 0.3s ease;

        .activity-cover {
          width: 100%;
          aspect-ratio: 3 / 4;
          border-radius: 0.375rem;
          overflow: hidden;

          .cover-image {
            width: 100%;
            height: 100%;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;

            &:not(.has-cover) {
              background-color: var(--background-color);
            }

            .placeholder {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: var(--weak-color);
            }
          }
        }

        .activity-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;

          .activity-title {
            font-weight: 600;
            color: var(--primary-color);
            font-size: 1rem;
            line-height: 1.4;
          }

          .activity-date {
            color: var(--remark-color);
            font-size: 0.75rem;
            font-family: var(--monospace);
          }

          .activity-excerpt {
            color: var(--remark-color);
            font-size: 0.875rem;
            line-height: 1.6;
            overflow: hidden;
            max-width: 100%;
            word-wrap: break-word;
          }
        }
      }
    }
  }
</style>

<main class="flex flex-col sm:flex-row gap-8 grow">
  <!-- Main content area with status rows -->
  <article class="flex flex-col gap-10 grow">
    {#if inProgressBooks.length > 0}
      <div class="status-row">
        <h2>{t('library.status.in_progress')}</h2>
        <div class="books-grid">
          {#each inProgressBooks as book (book.id)}
            <a
              href={getRelativeLocaleUrl(locale, `/library/${book.id.split('/').slice(1).join('/')}`)}
              class="book-card"
              onmouseenter={() => setHoveredBook(book)}
              onmouseleave={() => clearHoveredBook()}
            >
              <ProgressRing
                status={book.data.status}
                progress={book.progress}
                size={100}
                theme={theme}
              >
                <div class="w-full h-full flex items-center justify-center c-weak">
                  {#if book.data.type === 'book' && icons['icon-book']}
                    {@render icons['icon-book']()}
                  {:else if book.data.type === 'video_series' && icons['icon-video_series']}
                    {@render icons['icon-video_series']()}
                  {:else if book.data.type === 'course' && icons['icon-course']}
                    {@render icons['icon-course']()}
                  {/if}
                </div>
              </ProgressRing>
              <div class="book-info">
                <div class="book-title">{book.data.title}</div>
                {#if book.data.author}
                  <div class="book-author">{book.data.author}</div>
                {/if}
                <div class="book-progress">{book.progress}%</div>
              </div>
            </a>
          {/each}
        </div>
      </div>
    {/if}

    {#if todoBooks.length > 0}
      <div class="status-row">
        <h2>{t('library.status.todo')}</h2>
        <div class="books-grid">
          {#each todoBooks as book (book.id)}
            <a
              href={getRelativeLocaleUrl(locale, `/library/${book.id.split('/').slice(1).join('/')}`)}
              class="book-card"
              onmouseenter={() => setHoveredBook(book)}
              onmouseleave={() => clearHoveredBook()}
            >
              <ProgressRing
                status={book.data.status}
                progress={book.progress}
                size={100}
                theme={theme}
              >
                <div class="w-full h-full flex items-center justify-center c-weak">
                  {#if book.data.type === 'book' && icons['icon-book']}
                    {@render icons['icon-book']()}
                  {:else if book.data.type === 'video_series' && icons['icon-video_series']}
                    {@render icons['icon-video_series']()}
                  {:else if book.data.type === 'course' && icons['icon-course']}
                    {@render icons['icon-course']()}
                  {/if}
                </div>
              </ProgressRing>
              <div class="book-info">
                <div class="book-title">{book.data.title}</div>
                {#if book.data.author}
                  <div class="book-author">{book.data.author}</div>
                {/if}
                <div class="book-progress">{book.progress}%</div>
              </div>
            </a>
          {/each}
        </div>
      </div>
    {/if}

    {#if doneBooks.length > 0}
      <div class="status-row">
        <h2>{t('library.status.done')}</h2>
        <div class="books-grid">
          {#each doneBooks as book (book.id)}
            <a
              href={getRelativeLocaleUrl(locale, `/library/${book.id.split('/').slice(1).join('/')}`)}
              class="book-card"
              onmouseenter={() => setHoveredBook(book)}
              onmouseleave={() => clearHoveredBook()}
            >
              <ProgressRing
                status={book.data.status}
                progress={book.progress}
                size={100}
                theme={theme}
              >
                <div class="w-full h-full flex items-center justify-center c-weak">
                  {#if book.data.type === 'book' && icons['icon-book']}
                    {@render icons['icon-book']()}
                  {:else if book.data.type === 'video_series' && icons['icon-video_series']}
                    {@render icons['icon-video_series']()}
                  {:else if book.data.type === 'course' && icons['icon-course']}
                    {@render icons['icon-course']()}
                  {/if}
                </div>
              </ProgressRing>
              <div class="book-info">
                <div class="book-title">{book.data.title}</div>
                {#if book.data.author}
                  <div class="book-author">{book.data.author}</div>
                {/if}
                <div class="book-progress">{book.progress}%</div>
              </div>
            </a>
          {/each}
        </div>
      </div>
    {/if}

    {#if inProgressBooks.length === 0 && todoBooks.length === 0 && doneBooks.length === 0}
      <div class="flex flex-col items-center justify-center py-20 c-weak">
        {#if icons['icon-empty']}
          {@render icons['icon-empty']()}
        {/if}
        <p class="mt-4 text-lg">
          {selectedTags.length > 0 ? t('library.noMatches') : t('library.empty')}
        </p>
      </div>
    {/if}
  </article>

  <!-- Sidebar -->
  <aside class="sm:flex-basis-280px flex flex-col gap-8 sm:border-l sm:border-l-solid sm:pl-8">
    <!-- Tag filter section -->
    {#if allTags.length > 0}
      <section>
        <h3>{t('library.filterByTag')}</h3>
        <div class="tag-list">
          {#each allTags as tag (tag)}
            <button class:selected={selectedTags.includes(tag)} onclick={() => toggleTag(tag)}>
              {tag}
            </button>
          {/each}
        </div>
      </section>
    {/if}

    <!-- Latest activity section -->
    {#if displayBook}
      <section>
        <h3>{hoveredBook ? t('library.thisReadingSession') : t('library.latestActivity')}</h3>
        <div class="activity-card">
          <div class="activity-cover">
            <div
              class="cover-image"
              class:has-cover={displayBook.data.cover}
              style={displayBook.data.cover ? `background-image: url('${displayBook.data.cover}')` : ''}
              role="img"
              aria-label={displayBook.data.title}
            >
              {#if !displayBook.data.cover}
                <div class="placeholder">
                  {#if displayBook.data.type === 'book' && icons['icon-book-large']}
                    {@render icons['icon-book-large']()}
                  {:else if displayBook.data.type === 'video_series' && icons['icon-video_series-large']}
                    {@render icons['icon-video_series-large']()}
                  {:else if displayBook.data.type === 'course' && icons['icon-course-large']}
                    {@render icons['icon-course-large']()}
                  {/if}
                </div>
              {/if}
            </div>
          </div>
          <div class="activity-info">
            <div class="activity-title">{displayBook.data.title}</div>
            {#if displayBook.latestDate}
              <div class="activity-date">{formatDate(displayBook.latestDate)}</div>
            {/if}
            <div class="activity-excerpt">{displayBook.excerpt || t('library.noExcerpt')}</div>
          </div>
        </div>
      </section>
    {/if}
  </aside>
</main>

<script lang="ts">
  import { getRelativeLocaleUrl } from 'astro:i18n';
  import ProgressRing from '$components/ProgressRing.svelte';
  import Time from '$utils/time';
  import i18nit from '$i18n';

  type KnowledgeItem = {
    id: string;
    data: any;
    body: string;
    progress: number;
    excerpt: string;
    latestDate: Date | null;
  };

  import type { Snippet } from 'svelte';

  type Icons = {
    'icon-book'?: Snippet;
    'icon-video_series'?: Snippet;
    'icon-course'?: Snippet;
    'icon-book-large'?: Snippet;
    'icon-video_series-large'?: Snippet;
    'icon-course-large'?: Snippet;
    'icon-empty'?: Snippet;
  };

  let {
    locale,
    books,
    allTags,
    theme = 'plain',
    ...icons
  }: {
    locale: string;
    books: KnowledgeItem[];
    allTags: string[];
    theme?: string;
  } & Icons = $props();

  const t = i18nit(locale);

  // State for tag filtering
  let selectedTags = $state<string[]>([]);

  // State for hover interaction
  let hoveredBook = $state<KnowledgeItem | null>(null);

  // Filter books by selected tags
  const filteredBooks = $derived.by(() => {
    if (selectedTags.length === 0) {
      return books;
    }

    return books.filter(book => {
      if (!book.data.tags || book.data.tags.length === 0) {
        return false;
      }
      // Check if book contains ALL selected tags (AND logic, same as Note/Jotting)
      return selectedTags.every(tag => book.data.tags.includes(tag));
    });
  });

  // Group filtered books by status
  const inProgressBooks = $derived(filteredBooks.filter(book => book.data.status === 'in_progress'));
  const todoBooks = $derived(filteredBooks.filter(book => book.data.status === 'todo'));
  const doneBooks = $derived(filteredBooks.filter(book => book.data.status === 'done'));

  // Determine which book to display in the sidebar
  // Priority: hovered book > most recently edited book from filtered results
  const displayBook = $derived(
    hoveredBook ||
      filteredBooks
        .filter(book => book.latestDate)
        .sort((a, b) => b.latestDate!.getTime() - a.latestDate!.getTime())[0] ||
      filteredBooks[0]
  );

  // Toggle tag selection
  function toggleTag(tag: string) {
    if (selectedTags.includes(tag)) {
      selectedTags = selectedTags.filter(t => t !== tag);
    } else {
      selectedTags = [...selectedTags, tag];
    }
  }

  // Set hovered book
  function setHoveredBook(book: KnowledgeItem) {
    hoveredBook = book;
  }

  // Clear hovered book
  function clearHoveredBook() {
    hoveredBook = null;
  }

  // Format date for display
  function formatDate(date: Date): string {
    return Time.date(date);
  }
</script>
