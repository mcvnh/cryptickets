import { Env } from '../types/env';

export default {
  async push(env: Env, key: string, pushingValue: string): Promise<void> {
    const isExists = await this.exists(env, key, pushingValue);

    if (!isExists) {
      const { success, error } = await env.DB
        .prepare('insert into ignores (channel_id, slug) values (?, ?)')
        .bind(key, pushingValue)
        .run();

      if (!success) {
        throw new Error(error);
      }
    }
  },

  async remove(env: Env, key: string, removingValue: string): Promise<void> {
    const { success, error } = await env.DB
      .prepare('delete from ignores where channel_id = ? and slug = ?')
      .bind(key, removingValue)
      .run();

    if (!success) {
      throw new Error(error);
    }
  },

  async get(env: Env, key: string): Promise<any[]> {
    const { results } = await env.DB
      .prepare('select id, channel_id, slug from ignores where channel_id = ?')
      .bind(key)
      .all();

    return results;
  },

  async exists(env: Env, key: string, slug: string): Promise<boolean> {
    const { results } = await env.DB
      .prepare('select id, channel_id, slug from ignores where channel_id = ? and slug = ?')
      .bind(key, slug)
      .all();

    return results.length > 0;
  }
}