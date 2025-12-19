import { Document } from '../types/document';

const STORAGE_KEY = 'documents';

export const storage = {
  getDocuments(): Document[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading documents from storage:', error);
      return [];
    }
  },

  saveDocument(document: Document): void {
    try {
      const documents = this.getDocuments();
      const existingIndex = documents.findIndex(doc => doc.id === document.id);
      
      if (existingIndex >= 0) {
        documents[existingIndex] = document;
      } else {
        documents.push(document);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
    } catch (error) {
      console.error('Error saving document to storage:', error);
    }
  },

  deleteDocument(id: string): void {
    try {
      const documents = this.getDocuments();
      const filtered = documents.filter(doc => doc.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting document from storage:', error);
    }
  },

  getDocument(id: string): Document | null {
    const documents = this.getDocuments();
    return documents.find(doc => doc.id === id) || null;
  }
};