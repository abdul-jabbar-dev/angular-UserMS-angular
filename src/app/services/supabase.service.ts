import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabaseUrl: string = 'https://hjbmpwhdfhhbabkepizk.supabase.co';
  private supabaseKey: string =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqYm1wd2hkZmhoYmFia2VwaXprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI5NDM5MjUsImV4cCI6MjAzODUxOTkyNX0._7FiD-vFeN0wjbDd7pwnKA8-iJ6Po-7hXybP4AefnAE';
  supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
 
  }

  async getData(table: string) {
    let { data, error } = await this.supabase.from(table).select('*');
    if (error) {
      console.error('Error fetching data:', error);
    }
    return data;
  }

  async insertData(table: string, newData: any) {
    let data = await this.supabase.from(table).insert(newData);

    if (data?.error) {
      console.error('Error inserting data:', data?.error);
    } else {
      return data;
    }
    return data;
  }

  async updateData(table: string, id: string, updatedData: any) {
    let { data, error } = await this.supabase
      .from(table)
      .update(updatedData)
      .eq('id', id);
    if (error) {
      console.error('Error updating data:', error);
    }
    return data;
  }

  async deleteData(table: string, id: string) {
    let { data, error } = await this.supabase.from(table).delete().eq('id', id);
    if (error) {
      console.error('Error deleting data:', error);
    }
    return data;
  }
  async uploadAvatar(filePath: string, file: File) { 
    return await this.supabase.storage
      .from('media')
      .upload(filePath + '__' + Date.now(), file, {
        upsert: false,
      });
  }
  async deleteAvatar(filePath: string) {
    return await this.supabase.storage.from('media').remove([filePath]);
  }
}
