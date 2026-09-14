import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioMapper } from './mapper/portfolio.mapper';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get(':name')
  async findOne(@Param('name') name: string) {
    const portfolio = await this.portfolioService.findOne(name);
    
    return PortfolioMapper.toResponse(portfolio);
  }

  @Get(":slug/resume/download")
  async getResumeDownloadUrl(@Param("slug") slug: string){

    return await this.portfolioService.downloadResume(slug);
  }
}
