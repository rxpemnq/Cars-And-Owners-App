import { Injectable } from '@nestjs/common'
import { CreateSessionDto } from './dto/create-session.dto'
import { ReadSessionDto } from './dto/read-session.dto'
import { UpdateSessionDto } from './dto/update-session.dto'
import { DeleteSessionDto } from './dto/delete-session.dto'
import { Sessions } from './entities/session.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Sessions)
    private readonly sessionRepository: Repository<Sessions>
  ) {}

  async createSession(createSessionDto: CreateSessionDto) {
    return await this.sessionRepository.save({
      sid: createSessionDto.sid,
      session: createSessionDto.session,
      expires: createSessionDto.expires
    })
  }

  async readSession(readSessionDto: ReadSessionDto) {
    return await this.sessionRepository
      .createQueryBuilder('session')
      .where('sid = :sid', { sid: readSessionDto.sid })
      .getOne()
  }

  async updateSession({ sid, ...params }: UpdateSessionDto) {
    return await this.sessionRepository.update(sid, params)
  }

  async deleteSession(deleteSessionDto: DeleteSessionDto) {
    return await this.sessionRepository.delete({ sid: deleteSessionDto.sid })
  }
}
