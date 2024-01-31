import { WeeklyScheduleDTO } from "@/DTO/schedule.DTO";
import { RequestWithUser } from "@/interfaces/IRequest.interface";
import { ErrorWithStatus } from "@/interfaces/customErrors";
import { WeeklyScheduleService } from "@/services/schedule.service";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { RequestHandler } from "express";

export class WeeklyScheduleController {
    private service: WeeklyScheduleService
    constructor() {
        this.service = new WeeklyScheduleService();
    }

    createWeeklyScheduleEntry: RequestHandler = async (req: RequestWithUser, res, next): Promise<void> => {
        try {
            const user = req.user;
            if (!user) throw new ErrorWithStatus("Unauthorized", 403);
            req.body.id = undefined
            const newScheduleDTO = plainToInstance(WeeklyScheduleDTO, req.body);
            newScheduleDTO.author = user.id;
            const DTOErr = await validate(newScheduleDTO);
            if (DTOErr && DTOErr.length > 0) throw DTOErr
            const result = await this.service.creatEweeklySchedule(newScheduleDTO);
            if (result) {
                res.send({
                    success: true,
                    payload: result,
                });
            }
            else {
                throw new Error('Failed to create schedule')
            }
        }
        catch (e) {
            next(e)
        }
    };

    getAllWeeklySchedules: RequestHandler = async (req, res, next) => {
        try {
            const schedules = await this.service.getAllWeeklySchedules()
            res.status(200).send({
                success: true,
                payload: schedules
            })
        } catch (e) {
            next(e)
        }
    }

    getWeeklyScheduleById: RequestHandler = async (req, res, next): Promise<void> => {
        const { id } = req.params;
        try {
            const schedule = await this.service.getWeeklyScheduleById(id);
            if (schedule) {
                res.status(200).send({
                    success: true,
                    payload: schedule,
                });
            } else {
                throw new ErrorWithStatus('Schedule not found', 400)
            }
        } catch (err) {
            next(err);
        }
    };
}