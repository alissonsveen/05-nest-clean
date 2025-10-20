import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from "@nestjs/common"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"
import z from "zod"
import { CommentPresenter } from "../presenters/comment-presenter"
import { FetchAnswerCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-answer-comments"
import { CommnetWithAuthorPresenter } from "../presenters/comment-with-author-presenter"

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)
type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller("/answers/:answersId/comments")
export class FetchAnswerCommentsController {
  constructor(private FetchAnswerComments: FetchAnswerCommentsUseCase) {}

  @Get()
  async handle(
    @Query("page", queryValidationPipe) page: PageQueryParamSchema,
    @Param("answerId") answerId: string
  ) {
    const result = await this.FetchAnswerComments.execute({
      page,
      answerId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const answerComments = result.value.comments

    return { comments: answerComments.map(CommnetWithAuthorPresenter.toHTTP) }
  }
}
