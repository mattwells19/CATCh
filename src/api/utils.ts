export async function getCollectionEntries<CollectionType extends {}>(
  collectionName: string,
): Promise<Array<CollectionType>> {
  const collectionEntries: Array<CollectionType> = await fetch(
    `https://catch.theater/cockpit/api/collections/get/${collectionName}?token=${
      import.meta.env.COCK_TOKEN
    }`,
  )
    .then((collection) => collection.json())
    .then((collection) => collection.entries);

  return collectionEntries;
}
