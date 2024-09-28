import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Retell from 'retell-sdk';

@Injectable()
export class CallService {
  constructor(private prisma: PrismaService) {}

  async handleCallStarted(data: Retell.Call.PhoneCallResponse) {
    const userNumber =
      data.direction === 'inbound' ? data.from_number : data.to_number;

    // Upsert user
    const user = await this.prisma.user.upsert({
      where: { phoneNumber: userNumber },
      update: {},
      create: { phoneNumber: userNumber },
    });

    // Create call record
    await this.prisma.call.create({
      data: {
        retellCallId: data.call_id,
        callObject: this.formatCallObject(data),
        startedAt: data.start_timestamp ? new Date(data.start_timestamp) : null,
        userId: user.id,
      },
    });
  }

  async handleCallEnded(data: Retell.Call.PhoneCallResponse) {
    await this.prisma.call.update({
      where: { retellCallId: data.call_id },
      data: {
        callObject: this.formatCallObject(data),
        endedAt: data.end_timestamp ? new Date(data.end_timestamp) : null,
      },
    });
  }

  async handleCallAnalyzed(data: Retell.Call.PhoneCallResponse) {
    const updatedCall = await this.prisma.call.update({
      where: { retellCallId: data.call_id },
      data: {
        callObject: this.formatCallObject(data),
        transcript: this.formatCallObject(
          data.transcript_object?.map((el) => ({
            content: el.content,
            role: el.role,
          })) ?? {},
        ),
        recordingUrl: data.recording_url,
      },
    });

    // Call playlistService to generate playlist
    // await this.playlistService.generatePlaylist(updatedCall.id);
  }

  private formatCallObject(data: any) {
    return JSON.parse(JSON.stringify(data));
  }
}
