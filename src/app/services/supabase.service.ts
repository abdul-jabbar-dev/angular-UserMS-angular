import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabaseUrl: string = 'https://vdlbpitmjmlzfxhvgyxo.supabase.co';
  private supabaseKey: string =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkbGJwaXRtam1semZ4aHZneXhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI3NzM2NzgsImV4cCI6MjAzODM0OTY3OH0.yKAebcoV2IF5a-FoMXkhfptUNQPAuK12rmEiWCYUQPg';
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
    console.log(data);
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
  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage
      .from('media')
      .upload(filePath + '__' + Date.now(), file, {
        upsert: false,
      });
  }
}
