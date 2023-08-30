import payload from "payload";

type CollectionData = {
  id: string;
  data: any; 
};

export async function updateDocumentInCollection(collection: string, id: string, data: any): Promise<CollectionData> {
  const updatedDocument = await payload.update({
    collection,
    id,
    data,
  });

  return updatedDocument;
}
