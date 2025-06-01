
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArchivesSearchBar } from "./ArchivesSearchBar";
import { ArchivesSortBar } from "./ArchivesSortBar";
import { ArchiveDocumentsList } from "./ArchiveDocumentsList";
import { Document } from "@/types/document";

interface ArchiveFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedSort: string;
  onSortChange: (value: string) => void;
  categories: { id: string; name: string }[];
  filteredDocuments: Document[];
  isLoading: boolean;
  getCategoryName: (categoryId: string) => string;
  onView: (doc: Document) => void;
  onEdit: (doc: Document) => void;
  onDelete: (doc: Document) => void;
}

export const ArchiveFilters = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedSort,
  onSortChange,
  categories,
  filteredDocuments,
  isLoading,
  getCategoryName,
  onView,
  onEdit,
  onDelete,
}: ArchiveFiltersProps) => {
  return (
    <>
      <ArchivesSearchBar 
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />

      <Tabs 
        defaultValue="all" 
        className="space-y-4"
        value={selectedCategory}
        onValueChange={onCategoryChange}
      >
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          {categories.map(category => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          <div className="rounded-md border">
            <ArchivesSortBar 
              documentCount={filteredDocuments.length}
              selectedSort={selectedSort}
              onSortChange={onSortChange}
            />

            <ArchiveDocumentsList
              documents={filteredDocuments}
              isLoading={isLoading}
              getCategoryName={getCategoryName}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};
