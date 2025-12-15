import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({
    description: 'Contenido del mensaje',
    example: 'Hola, ¿cómo estás?',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'ID del usuario remitente', example: 'user-123' })
  @IsString()
  @IsNotEmpty()
  author_id: string;

  @ApiProperty({ description: 'ID del usuario receptor', example: 'user-456' })
  @IsString()
  @IsNotEmpty()
  receiver_id: string;
}
