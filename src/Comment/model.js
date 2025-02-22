import dayjs from 'dayjs';

class Comment {
  constructor(object) {
    this.id = object.id || null;
    this.author = object.author || null;
    this.comment = object.comment || null;
    this.dtable_uuid = object.dtable_uuid || null;
    this.row_id = object.row_id || null;
    this.created_at = object.created_at || null;
    this.updated_at = object.updated_at || null;
    this.resolved = object.resolved || 0;

    if (this.created_at) {
      const time = (new Date(this.created_at)).getTime();
      this.created_at = dayjs(time).format('YYYY-MM-DD HH:mm');
    }
  }
}

export default Comment;
